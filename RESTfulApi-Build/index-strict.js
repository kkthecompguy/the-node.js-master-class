/*
* Primary file for the API
*
*/
"use strict";

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

// declare the app
const app = {};

foo = "bar";


// init function
app.init = function() {
  // start the server
  server.init();

  // start the workers
  workers.init();

  // start the cli, but make sure it starts last
  setTimeout(function() {
    cli.init();
  }, 50);
}


// execute
app.init();


// export the app
module.exports = app;