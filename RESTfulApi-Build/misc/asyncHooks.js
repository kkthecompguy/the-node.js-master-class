/*
* Async Hooks Example
*
*/

// Dependencies
const async_hooks = require("async_hooks");
const fs = require("fs");

// target execution context
const targetExecutionContext = false;

// write an arbitrary async function
let whatTimeIsIt = function(callback) {
  setInterval(function() {
   fs.writeSync(1, "When the setInterval runs, the execution context is "+async_hooks.executionAsyncId() +"\n") 
   callback(Date.now());
  }, 1000);
}

// call that function
whatTimeIsIt(function(time) {
  fs.writeSync(1, "The time is "+time+"\n");
});


// Hooks
const hooks = {
  init(asyncId, type, triggerAsyncId, resource) {
    fs.writeSync(1, "Hook init "+asyncId+"\n");
  },
  before(asyncId) {
    fs.writeSync(1, "Hook before "+asyncId+"\n");
  },
  after(asyncId) {
    fs.writeSync(1, "Hook after "+asyncId+"\n");
  },
  destroy(asyncId) {
    fs.writeSync(1, "Hook destroy "+asyncId+"\n");
  },
  promiseResolve(asyncId) {
    fs.writeSync(1, "Hook promiseResolve "+asyncId+"\n");
  },
}


// create a new asyncHooks instance
const asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();