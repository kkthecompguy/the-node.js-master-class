/*
* These are CLI related tasks
*
*/

// Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog("cli");
const events = require('events');
const os = require("os");
const v8 = require("v8");
const childProcess = require("child_process");
const _data = require("./data");
const _logs = require("./logs");
const helpers = require("./helpers");


// extends events class (recommended)
class _events extends events {};
const e = new _events();

// instantiate cli object;
const cli = {};


// input handlers
e.on("man", function(str) {
  cli.responders.help();
});


e.on("help", function(str) {
  cli.responders.help();
});

e.on("exit", function(str) {
  cli.responders.exit();
});

e.on("stats", function(str) {
  cli.responders.stats();
});

e.on("list users", function(str) {
  cli.responders.listUsers();
});


e.on("more user info", function(str) {
  cli.responders.moreUserInfo(str);
});

e.on("list checks", function(str) {
  cli.responders.listChecks(str);
});

e.on("more check info", function(str) {
  cli.responders.moreCheckInfo(str);
});

e.on("list logs", function(str) {
  cli.responders.listLogs();
});

e.on("more log info", function(str) {
  cli.responders.moreLogInfo(str);
});

// responders object
cli.responders = {};

// help / man
cli.responders.help = function() {
  let commands = {
    "exit": "Kill the CLI (and the rest of the application)",
    "man" : "Show this help page",
    "help": "Alias of man command",
    "stats": "Get statistics on the underlying operating system and resource utilization",
    "list users": "Show a list of all the registered (undeleted) users in the system",
    "more user info --{userId}": "Show details of a specific user",
    "list checks --up --down": "Show a list of all the active checks in the system, including their state. The '--up' and '--down' flags are both optional",
    "more check info --{checkId}": "Show details of a specified check",
    "list logs": "Show a list of all the log files available to be read (compressed only)",
    "more log info --{fileName}": "Show details of a specified log file"
  };

  // show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered("CLI MANUAL");
  cli.horizontalLine();
  cli.verticalSpace(2);

  // show each command followed by its explanation in white and yellow respectively
  for (let key in commands) {
    if (commands.hasOwnProperty(key)) {
      let value = commands[key];
      let line = `\x1b[33m${key}\x1b[0m`;
      let padding = 60 - line.length;
      for (let i = 0; i<padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);

  // end with another horizontalLine
  cli.horizontalLine();
}

// create vertical space
cli.verticalSpace = function(n) {
  let lines = typeof(n) === "number" && n > 0 ? n : 1;
  for (let i = 0; i < lines; i++) {
    console.log(""); 
  }
}

// create a horizontal line across the screen
cli.horizontalLine = function() {
  // get the available screen size
  let width = process.stdout.columns;
  let line = "";
  for (let i = 0; i < width; i++) {
    line += "-"
  }
  console.log(line);
}

// create centered text on the screen
cli.centered = function(inputStr) {
  let str = typeof(inputStr) === "string" && inputStr.trim().length > 0 ? inputStr.trim() : "";
  // get the available screen size
  let width = process.stdout.columns;

  // calculate the left padding there should be
  let leftPadding = Math.floor((width - str.length) / 2);

  // put in left padded spaces before the string itself
  let line = "";
  for (let i = 0; i < leftPadding; i++) {
    line += " ";
  }
  line+=str;
  console.log(line);
}

// exit
cli.responders.exit = function() {
  process.exit(0);
}

// stats
cli.responders.stats = function() {
  // compile an object of stats
  let stats = {
    "Load Average": os.loadavg().join(" "),
    "CPU Count": os.cpus().length,
    "Free Memory": os.freemem(),
    "Current Malloced Memory": v8.getHeapStatistics().malloced_memory,
    "Peak Malloced Memory": v8.getHeapStatistics().peak_malloced_memory,
    "Allocated Heap Used (%)": Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    "Available Heap Allocated (%)": Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    "Uptime": os.uptime() + " seconds"
  }

  // show a header for the stats
  cli.horizontalLine();
  cli.centered("SYSTEM STATISTICS");
  cli.horizontalLine();
  cli.verticalSpace(2);

  // log out each status
  for (let key in stats) {
    if (stats.hasOwnProperty(key)) {
      let value = stats[key];
      let line = `\x1b[33m${key}\x1b[0m`;
      let padding = 60 - line.length;
      for (let i = 0; i<padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);

  // end with another horizontalLine
  cli.horizontalLine();

}

// list users
cli.responders.listUsers = function() {
  _data.list("users", function(err, userIds) {
    if (!err && userIds && userIds.length > 0) {
      cli.verticalSpace();
      userIds.forEach(function(userId) {
        _data.read("users", userId, function(err, userData) {
          if (!err && userData) {
            let line = `Name: ${userData.firstName} ${userData.lastName} Phone: ${userData.phone} Checks: `;
            let numChecks = typeof(userData.checks) === "object" && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
            line+=numChecks;
            console.log(line);
            cli.verticalSpace();
          }
        })
      })
    }
  })
}

// more user info
cli.responders.moreUserInfo = function(str) {
  // get the id from the string
  let arr = str.split("--");
  let userId = typeof(arr[1]) === "string" && arr[1].trim().length > 0 ? arr[1].trim(): false;
  if (userId) {
    // lookup the user
    _data.read("users", userId, function(err, userData) {
      if (!err && userData) {
        // remove the hashed password
        delete userData.hashedPassword;

        // print the JSON with text highlighting
        cli.verticalSpace();
        console.dir(userData, {"colors": true});
        cli.verticalSpace();
      }
    })
  }
}

// list checks
cli.responders.listChecks = function(str) {
  _data.list("checks", function(err, checkIds) {
    if (!err && checkIds && checkIds.length > 0) {
      cli.verticalSpace();
      checkIds.forEach(function(checkId) {
        _data.read("checks", checkId, function(err, checkData) {
          if (!err && checkData) {
            let includeCheck = false;
            let lowerString = str.toLowerCase();

            // get the state, default to down
            let state = typeof(checkData.state) === "string" ? checkData.state: "down"
            // get the state default to unknown
            let stateOrUnknown = typeof(checkData.state) === "string" ? checkData.state: "unknown";

            // if the user has specified the state, or hasn't specified any state, include the current check accordingly
            if (lowerString.indexOf("--"+state) > -1 || (lowerString.indexOf("--down") === -1 && lowerString.indexOf("--up") === -1)) {
              let line = `ID: ${checkData.id} ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} State: ${stateOrUnknown}`;
              console.log(line);
              cli.verticalSpace();
            }

          }
        })
      })
    }
  })
}

// more check info
cli.responders.moreCheckInfo = function(str) {
  // get the id from the string
  let arr = str.split("--");
  let checkId = typeof(arr[1]) === "string" && arr[1].trim().length > 0 ? arr[1].trim(): false;
  if (checkId) {
    // lookup the check
    _data.read("checks", checkId, function(err, checkData) {
      if (!err && checkData) {
        // print the JSON with text highlighting
        cli.verticalSpace();
        console.dir(checkData, {"colors": true});
        cli.verticalSpace();
      }
    })
  }
}

// list logs
cli.responders.listLogs = function() {
  let ls = childProcess.spawn("ls", ["./.logs/"]);
  ls.stdout.on('data', (dataObject) => {
    // explode into separate lines
    let dataStr = dataObject.toString();
    let logFileNames = dataStr.split("\n");

    cli.verticalSpace();
    logFileNames.forEach(function(logFileName) {
      if (typeof(logFileName) === "string" && logFileName.length > 0 && logFileName.indexOf("-") > -1) {
        console.log(logFileName.trim().split(".")[0]);
        cli.verticalSpace();
      }
    });
  });
}



// more log info
cli.responders.moreLogInfo = function(str) {
  // get the logfilename from the string
  let arr = str.split("--");
  let logFilename = typeof(arr[1]) === "string" && arr[1].trim().length > 0 ? arr[1].trim(): false;
  if (logFilename) {
    cli.verticalSpace();
    // decompress the log file
    _logs.decompress(logFilename, function(err, strData) {
      if (!err && strData) {
        // split into lines
        let arr = strData.split("\n");
        arr.forEach(function(jsonString) {
          let logObject = helpers.parseJsonToObject(jsonString);
          if (logObject && JSON.stringify(logObject) !== "{}") {
            console.dir(logObject, {"colors": true});
            cli.verticalSpace();
          }
        })
      }
    })
  }
}


// input processor
cli.processInput = function(inputStr) {
  let str = typeof(inputStr) === "string" && inputStr.trim().length > 0 ? inputStr.trim(): false;
  // only process the input if the user actually wrote something. Otherwise ignore
  if (str) {
    // codify the unique strings that identify the unique questions allowd to be asked
    let uniqueInputs = [
      "man",
      "help",
      "exit",
      "stats",
      "list users",
      "more user info",
      "list checks",
      "more check info",
      "list logs",
      "more log info"
    ];

    // go through the possible inputs, emit an event when a match is found
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some(function(input){
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true
        // emit an event matching the unique input and include the full string given by the user
        e.emit(input, str);
        return true
      }
    });

    // if no match found tell the user to try again
    if (!matchFound) {
      console.log("sorry try again");
    }
  }
}


// init script
cli.init = function () {
  // send the start message to the console in dark blue
  console.log("\x1b[34m%s\x1b[0m", `The CLI is running...`);

  // start the interface
  let _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
  });

  // create an initial prompt
  _interface.prompt();

  // handle each line of input separately
  _interface.on("line", function(str) {
    // send to the input processor
    cli.processInput(str);

    // re-initialize the prompt afterwards
    _interface.prompt();
  });

  // if the user stops the CLI, kill the associated process
  _interface.on("close", function() {
    process.emit(0);
  });
}



// export module
module.exports = cli;
