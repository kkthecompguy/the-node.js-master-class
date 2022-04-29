/*
* API Test
*
*/

// Dependencies
const app = require("../index");
const assert = require("assert");
const http = require("http");
const config = require("../lib/config");


// holder for the test
const api = {};


// helpers
const helpers = {};
helpers.makeGetRequest = function(path, callback) {
  // configure the request details
  let requestOptions = {
    protocol: 'http:',
    hostname: "localhost",
    port: config.httpPort,
    method: "GET",
    path: path,
    headers: {
      "Content-Type": "application/json"
    }
  }

  let req = http.request(requestOptions, function(res) {
    callback(res);
  });

  req.end()

  // send the request
}

// The main init() function should be able to run without throwing
api["app.init should start without throwing"] = function(done) {
  assert.doesNotThrow(function(){
    app.init(function(err) {
      done();
    })
  },TypeError)
};


// make a request to /ping
api["/ping should respond to GET with 200"] = function(done) {
  helpers.makeGetRequest("/ping", function(res) {
    assert.equal(res.statusCode, 200);
    done();
  });
}

// make a request to /api/users
api["/api/users should respond to GET with 400"] = function(done) {
  helpers.makeGetRequest("/api/users", function(res) {
    assert.equal(res.statusCode, 400);
    done();
  });
}

// make a request to random path
api["A random should respond to GET with 404"] = function(done) {
  helpers.makeGetRequest("/random/path/not/exist", function(res) {
    assert.equal(res.statusCode, 404);
    done();
  });
}



// export the test to the runner
module.exports = api;