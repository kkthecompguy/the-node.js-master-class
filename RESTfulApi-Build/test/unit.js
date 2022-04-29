/*
* Unit Test
*
*/


// Dependencies
const helpers = require("../lib/helpers");
const assert = require("assert");
const logs = require("../lib/logs")
const exampleDebuggingProblem = require("../lib/exampleDebuggingProblem");

// holder for test
const unit = {}

// assert the getNumber function is returning a number
unit["helpers.getNumber should return a number"] = function(done) {
  let val =  helpers.getNumber();
  assert.equal(typeof(val), "number");
  done();
};

// assert the getNumber function is returning 1
unit["helpers.getNumber should return 1"] = function(done) {
  let val =  helpers.getNumber();
  assert.equal(val, 1);
  done();
};

// assert the getNumber function is returning 2
unit["helpers.getNumber should return 2"] = function(done) {
  let val =  helpers.getNumber();
  assert.equal(val, 2);
  done();
};


// log.list should callback an array and a false error
unit["logs.list should callback a false error and an array of log names"] = function(done) {
  logs.list(true, function(err, logFileNames) {
    assert.equal(err, false);
    assert.ok(logFileNames instanceof Array);
    assert.ok(logFileNames.length > 1);
    done();
  });
}

// logs.truncate should not throw if logId doesn't exist
unit["logs.truncate should not throw if the logId doesnt exist. It should callback an error instead"] = function(done) {
  assert.doesNotThrow(function() {
    logs.truncate("I do not exist", function(err) {
      assert.ok(err);
      done();
    })
  }, TypeError);
}

// exampleDebuggingProblem.init should not throw (but it does)
unit["exampleDebuggingProblem.init should not throw when called"] = function(done) {
  assert.doesNotThrow(function() {
    exampleDebuggingProblem.init();
    done()
  }, TypeError);
}


// export the test to the runner
module.exports = unit;