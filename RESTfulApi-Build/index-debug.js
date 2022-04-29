/*
* Primary file for the API
*
*/

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const exampleDebuggingProblem = require("./lib/exampleDebuggingProblem");

// declare the app
const app = {};


// init function
app.init = function() {
  // start the server
  debugger;
  server.init();
  debugger;

  // start the workers
  debugger;
  workers.init();
  debugger;

  // start the cli, but make sure it starts last
  debugger;
  setTimeout(function() {
    debugger;
    cli.init();
  }, 50);
  debugger;

  // set foo to 1
  debugger;
  let foo = 1;
  console.log("just assigned 1 to foo");
  debugger;

  // increment foo
  foo++;
  console.log("just incremented foo");
  debugger;

  // square foo
  foo = foo * foo;
  console.log("just squared foo");
  debugger;

  // convert foo to a string
  foo = foo.toString();
  console.log("just converted foo to string foo");
  debugger;

  // call the init script that will throw
  exampleDebuggingProblem.init();
  console.log("just assigned 1 to foo");
  debugger;
}


// execute
app.init();


// export the app
module.exports = app;