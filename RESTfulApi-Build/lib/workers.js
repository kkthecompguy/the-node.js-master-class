/*
* These are worker-related tasks
*
*/

// Dependencies
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const url = require('url');
const helpers = require('./helpers');
const _data = require('./data');
const _logs = require('./logs');
const util = require("util");
const debug = util.debuglog("workers");


// instantiate the worker object
const workers = {};


// look up all checks, get their data and send to a validator
workers.gatherAllChecks = function() {
  // get all the checks
  _data.list("checks", function(err, checks) {
    if (!err && checks && checks.length > 0) {
      checks.forEach(function(check) {
        // read in the check data
        _data.read("checks", check, function(err, originalCheckData){
          if (!err && originalCheckData) {
            // pass it to the check validator, and let that function continue or log errors as needed
            workers.validateCheckData(originalCheckData)
          } else {
            debug(`error reading check with id ${check}`)
          }
        });
      });
    } else {
      debug("error: could not find any checks to process")
    }
  });
}


// sanity-check the check-data
workers.validateCheckData = function(checkData) {
  let originalCheckData = typeof(checkData) === "object" && checkData !== null ? checkData: {};
  originalCheckData.id = typeof(originalCheckData.id) === "string" && originalCheckData.id.trim().length === 20 ? originalCheckData.id.trim(): false;
  originalCheckData.userPhone = typeof(originalCheckData.userPhone) === "string" && originalCheckData.userPhone.trim().length === 10 ? originalCheckData.userPhone.trim(): false;
  originalCheckData.protocol = typeof(originalCheckData.protocol) === "string" && ["https", "http"].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol: false;
  originalCheckData.url = typeof(originalCheckData.url) === "string" && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim(): false;
  originalCheckData.method = typeof(originalCheckData.method) === "string" && ["post", "get", "put", "delete"].indexOf(originalCheckData.method) > -1 ? originalCheckData.method: false;
  originalCheckData.successCodes = typeof(originalCheckData.successCodes) === "object" && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes: false;
  originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) === "number" && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;

  // set the keys that may not be set (if the workers have never seen this check before)
  originalCheckData.state = originalCheckData.state = typeof(originalCheckData.state) === "string" && ["up", "down"].indexOf(originalCheckData.state) > -1 ? originalCheckData.state: "down";
  originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) === "number" && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

  // if all the checks pass, pass the data along to the next step in the process
  if (originalCheckData.id && 
    originalCheckData.userPhone &&
    originalCheckData.protocol &&
    originalCheckData.url &&
    originalCheckData.method &&
    originalCheckData.successCodes &&
    originalCheckData.timeoutSeconds) {
    workers.performCheck(originalCheckData)
  } else {
    console("error sanity-check failed, could not proceed")
  }
}


// perform the check, send the originalCheckData and outcome of the check process to the next step in the step
workers.performCheck = function(originalCheckData) {
  // prepare the initial check outcome
  let checkOutcome = {
    error: false,
    responseCode: false
  }

  // mark that the outcome has not been sent yet
  let outcomeSent = false;

  // parse the hostname and the path out of the original check data
  let parsedUrl = new url.URL(`${originalCheckData.protocol}://${originalCheckData.url}`)
  let hostname = parsedUrl.hostname;
  let pathUrl  = `${parsedUrl.pathname}${parsedUrl.search}`

  // construct the request
  let requestOptions = {
    protocol: originalCheckData.protocol+":",
    hostname,
    method: originalCheckData.method.toUpperCase(),
    path: pathUrl,
    timeout: originalCheckData.timeoutSeconds * 1000
  };

  // instantiate the request object (using either http or https module)
  let _moduleToUse = originalCheckData.protocol === "http" ? http: https;
  let req = _moduleToUse.request(requestOptions, function(res) {
    // grab the status of the sent request
    let status = res.statusCode;
    debug(res.statusMessage, res.statusCode);

    // update the checkout and pass the data along
    checkOutcome.responseCode = status;
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true
    }
  });

  // bind to the error event so it doesn't get thrown
  req.on("error", function(err) {
    // update the checkout and pass the data along
    checkOutcome.error = {
      error: true,
      value: err
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true
    }
  });

  // bind to the timeout event
  req.on("timeout", function(err) {
    // update the checkout and pass the data along
    checkOutcome.error = {
      error: true,
      value: "timeout"
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true
    }
  });

  // end the request
  req.end();

};


// process check outcome and update the check data as needed and trigger an alert if needed
// special logic for accomodating a check that has never been tested before (dont alert on that one)
workers.processCheckOutcome = function(originalCheckData, checkOutcome) {
  // decide if the check is considered up or down
  let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? "up" : "down";

  // decide if an alert is warranted
  let alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true: false;

  // log the outcome
  let timeOfCheck = Date.now()
  workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

  // update the check data
  let newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = timeOfCheck;

  // save the updates disk
  _data.update("checks", newCheckData.id, newCheckData, function(err) {
    if (!err) {
      // send the new check data to the next phase of the process if needed
      if (alertWarranted) {
        workers.alertUserToStatusChange(newCheckData);
      } else {
        debug("check outcome has not changed, no alert needed")
      }
    } else {
      debug("error trying to save the updates to one of the checks");
    }
  })
}


// alert user of status change
workers.alertUserToStatusChange = function(newCheckData) {
  let message = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
  helpers.sendTwilioSms(newCheckData.userPhone, message, function(err) {
    if (!err) {
      debug("success: User was alerted to a status change in their check via sms", message);
    } else {
      debug("error, could not send sms alert to user who had a status change in their check", err);
    }
  })
}


// log the outcome to file
workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) {
  // form the log data
  let logData = {
    check: originalCheckData,
    outcome: checkOutcome,
    state,
    alert: alertWarranted,
    time: timeOfCheck
  }

  // convert data to a string
  let logString = JSON.stringify(logData);

  // determine the name of the log file
  let logFileName = originalCheckData.id;

  // append the log to the file
  _logs.append(logFileName, logString, function(err) {
    if (!err) {
      debug("logging to the file succeeded");
    } else {
      debug("logging to the file failed");
    }
  })

}


// timer to execute the worker-process once per minute
workers.loop = function() {
  setInterval(function() {
    workers.gatherAllChecks();
  }, 1000 * 60 * 60); // will change later on;
}


// rotate (compress) the log files
workers.rotate = function() {
  // list all the (non compressed) log files
  _logs.list(false, function(err, logs) {
    if (!err && logs && logs.length > 0) {
      logs.forEach(function(log) {
        // compress the data to a different file
        let logId = log.replace(".log", "");
        let newFileId = `${logId}-${Date.now()}`;
        _logs.compress(logId, newFileId, function(err) {
          if (!err) {
            // truncate the log
            _logs.truncate(logId, function(err) {
              if (!err) {
                debug("success truncating log file");
              } else {
                debug("error truncating log file");
              }
            })
          } else {
            debug("error compressing one of the file", err);
          }
        })
      })
    } else {
      debug("could not find logs to rotate");
    }
  })
};


// timer to execute log rotation once per day
workers.logRotationLoop = function() {
  setInterval(function(){
    workers.rotate();
  },1000*60*60*24);
}


// init script
workers.init = function() {
  // send to console, in yellow
  console.log("\x1b[33m%s\x1b[0m", "Background workers are running");
  // execute all the checks immediately
  workers.gatherAllChecks();

  // call the loop so the checks will execute later on
  workers.loop();

  // compress all the logs immediately
  workers.rotate();

  // call the compression loops so logs will be compressed later on
  workers.logRotationLoop();
}



// export the module
module.exports = workers;