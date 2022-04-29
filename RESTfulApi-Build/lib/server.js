/*
* These are server related-tasks
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const path = require('path');
const config = require('./config');
const handlers = require('./handlers');
const helpers = require('./helpers');
const util = require("util");
const debug = util.debuglog("server")


// instantiate the server module
const server = {};


// instantiate the HTTP server
server.httpServer = http.createServer(function(req, res) {
  server.unifiedServer(req, res);
});


// instantiate HTTPS server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res){
  server.unifiedServer(req, res);
});




// all the server logic for both the http and https server
server.unifiedServer = function(req, res) {
  // get the url and parse
  const parsedUrl = url.parse(req.url, true);

  // get the path
  let path = parsedUrl.pathname
  let trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the HTTP method
  let method = req.method.toLowerCase();

  // Get query string as an object
  let queryStringObject = parsedUrl.query;

  // Get the headers as an object
  let headers = req.headers;
  console.log(headers)

  // Get the payload if any
  const decoder = new StringDecoder("utf-8")
  let buffer = "";
  req.on("data", function(data) {
    buffer += decoder.write(data)
  });

  req.on("end", function() {
    buffer += decoder.end();

    // chose the handle this request should go to
    // if not found go to notFound handler

    let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath]: handlers.notFound;

    // if the request is within the public directory, use the public handler instead
    chosenHandler = trimmedPath.indexOf("public/") > -1 ? handlers.public: chosenHandler

    // construct the data object

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer)
    }

    // route the request to the handler specified
    try {
      chosenHandler(data, function(statusCode, payload, contentType){
        server.processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType);
      });
    } catch (error) {
      debug(error);
      server.processHandlerResponse(res, method, trimmedPath, 500, {"error": "an unkown error has occurred"}, "json");
    }
    
  });
};


// process the response from the handler
server.processHandlerResponse = function(res, method, trimmedPath, statusCode, payload, contentType) {
  // determine the type of response (fallback to JSON)
  contentType = typeof(contentType) == "string" ? contentType: "json"

  // use the status code called back by the handler or default to 200
  statusCode = typeof(statusCode) === "number" ? statusCode: 200;

  // return the response parts that are content-specific
  let payloadString = "";
  if (contentType === "json") {
    res.setHeader('Content-Type', 'application/json');
    // use the payload called back by the handler or default to {}
    payload = typeof(payload) === "object" ? payload: {};
    // convert object to string
    payloadString = JSON.stringify(payload);

  }
  if (contentType === "html") {
    res.setHeader('Content-Type', 'text/html');
    // use the payload called back by the handler or default to ""
    payloadString = typeof(payload) === "string" ? payload: "";
  }
  if (contentType === "favicon") {
    res.setHeader('Content-Type', 'image/x-icon');
    // use the payload called back by the handler or default to ""
    payloadString = typeof(payload) !== "undefined" ? payload: "";
  }
  if (contentType === "css") {
    res.setHeader('Content-Type', 'text/css');
    // use the payload called back by the handler or default to ""
    payloadString = typeof(payload) !== "undefined" ? payload: "";
  }
  if (contentType === "png") {
    res.setHeader('Content-Type', 'image/png');
    // use the payload called back by the handler or default to ""
    payloadString = typeof(payload) !== "undefined" ? payload: "";
  }
  if (contentType === "jpg") {
    res.setHeader('Content-Type', 'image/jpeg');
    // use the payload called back by the handler or default to ""
    payloadString = typeof(payload) !== "undefined" ? payload: "";
  }
  if (contentType === "plain") {
    res.setHeader('Content-Type', 'text/plain');
    // use the payload called back by the handler or default to ""
    payloadString = typeof(payload) !== "undefined" ? payload: "";
  }

  // return the response-parts that are common to all content-types
  
  res.writeHead(statusCode);
  res.end(payloadString);

  // log the request path
  // if the response is 200 print green otherwise print red
  if (statusCode == 200) {
    debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`)
  } else {
    debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`)
  }
}




// Define a request router
server.router = {
  "": handlers.index,
  "account/create": handlers.accountCreate,
  "account/edit": handlers.accountEdit,
  "account/deleted": handlers.accountDeleted,
  "session/create": handlers.sessionCreate,
  "session/deleted": handlers.sessionDeleted,
  "checks/all": handlers.checksList,
  "checks/create": handlers.checksCreate,
  "checks/edit": handlers.checksEdit,
  "ping": handlers.ping,
  "api/users": handlers.users,
  "api/tokens": handlers.tokens,
  "api/checks": handlers.checks,
  "favicon.ico": handlers.favicon,
  "public": handlers.public,
  "examples/error": handlers.exampleError
};


// init script
server.init = function() {
  // start the HTTP server
  server.httpServer.listen(config.httpPort, function(){
    console.log("\x1b[36m%s\x1b[0m", `The server is listening on port ${config.httpPort}`);
  });

  // start the https server
  server.httpsServer.listen(config.httpsPort, function(){
    console.log("\x1b[35m%s\x1b[0m", `The server is listening on port ${config.httpsPort}`);
  });
}


// export the module
module.exports = server;