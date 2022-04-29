/*
* Library that demonstrates something throwing when init called
*
*
*/

// container for the module
const example = {};

// init function
example.init = function() {
  // this is an error created intentionally (bar is not defined)
  let foo = bar;
}



// export module
module.exports = example;