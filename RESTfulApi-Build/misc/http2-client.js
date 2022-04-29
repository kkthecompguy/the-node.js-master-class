/*
* Example HTTP2 Client
*
*/

// Dependencies
const http2 = require("http2");


// create client
const client = http2.connect("http://localhost:6000");


// create a request
const req = client.request({
  ":path": "/"
});

let str = "";
// when a message is received, add the pieces of it together until you reach the end
req.on("data", function(chunk) {
  str += chunk;
});


// when the message ends, log it out
req.on("end", function() {
  console.log(str)
});


// end the request
req.end()