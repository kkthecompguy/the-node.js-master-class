/*
* Primary file for the API
*
*/

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const cluster = require("cluster");
const os = require("os");


// declare the app
const app = {};


// init function
app.init = function(callback) {
  // if we are on the master thread, start the background workers and the CLI
  if (cluster.isMaster) {
    // start the workers
    workers.init();
  
    // start the cli, but make sure it starts last
    setTimeout(function() {
      cli.init();
      callback();
    }, 50);

    // fork the process
    for (let l = 0; l < os.cpus().length; l++) {
      cluster.fork();
    }
  } else {
    // if we are not on the master thread, start the HTTP server
    server.init();
  }

}


// self invoking only if required directly
if (require.main === module) {
  app.init(function(){});
}


// export the app
module.exports = app;