/*
* Test Runner
*
*/

// override the NODE_ENV variable
process.env.NODE_ENV = "testing";


// application logic for the test runner
_app = {};


// container for the test
_app.tests = {};


// add on the unit test
_app.tests.unit = require("./unit");
_app.tests.api = require("./api");



// count all the test
_app.countTests = function() {
  let counter = 0;
  for (let key in _app.tests) {
    if (Object.hasOwnProperty.call(_app.tests, key)) {
      const subTests = _app.tests[key];
      for (let testName in subTests) {
        if (Object.hasOwnProperty.call(subTests, testName)) {
          counter++
        }
      }
    }
  }
  return counter;
}


// produce test outcome report
_app.produceTestReport = function(limit, successes, errors) {
  console.log("");
  console.log("--------------BEGIN TEST REPORT----------");
  console.log("");
  console.log("Total Test: ", limit);
  console.log("Pass: ", successes);
  console.log("Fail: ", errors.length);
  console.log("");

  // if there are errors, print them in detail
  if (errors.length > 0) {
    console.log("--------------BEGIN ERROR DETAILS----------");
    console.log("");
    errors.forEach(function(testError) {
      console.log("\x1b[31m%s\x1b[0m", testError.name);
      console.log(testError.error);
      console.log("");
    })
    console.log("");
    console.log("--------------END ERROR DETAILS----------");
  }
  console.log("");
  console.log("--------------END TEST REPORT----------");
  process.exit(0);
}


// run all the test, collecting the errors and success
_app.runTests = function() {
  let errors = [];
  let successes = 0;
  let limit = _app.countTests();
  let counter = 0;

  for (let key in _app.tests) {
    if (Object.hasOwnProperty.call(_app.tests, key)) {
      let subTests = _app.tests[key];
      for (let testName in subTests) {
        if (Object.hasOwnProperty.call(subTests, testName)) {
          (function() {
            let tmpTestName = testName;
            let testValue = subTests[testName];
            // call the test
            try {
              testValue(function() {
                // if it calls back without throwing, then it succeeded, so log in green
                console.log("\x1b[32m%s\x1b[0m", tmpTestName);
                counter++;
                successes++;
                if (counter === limit) {
                  _app.produceTestReport(limit, successes, errors);
                }
              });
            } catch (error) {
              // if it throws, then it failed, so capture the error thrown and log it in red
              errors.push({
                name: testName,
                error: error
              });
              console.log("\x1b[31m%s\x1b[0m", tmpTestName);
              counter++
              if (counter === limit) {
                _app.produceTestReport(limit, successes, errors)
              }
            }
          })();
        }
      }
    }
  }
}


// run the test
_app.runTests();