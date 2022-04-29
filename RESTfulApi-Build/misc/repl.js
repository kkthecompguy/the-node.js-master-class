/*
* REPL (Read Eval Print Loop)
*
*/

// Dependencies
const repl = require("repl");

// start the REPL
repl.start({
  prompt: "> ",
  eval: function(str) {
    // evaluation function for incoming input
    console.log("At the evaluation stage: ", str);

    // if the user said "fizz", say "buzz" back to them
    if (str.indexOf("fizz") > -1 ) {
      console.log("buzz")
    } else {
      console.log("echoing back, ",str)
    }
  }
});