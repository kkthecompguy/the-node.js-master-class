/*
* Example TLS Client
* Connects to port 6000 and sends the word "ping" to server
*
*/

// Dependencies
const tls = require("tls");
const fs = require("fs");
const path = require("path");


// server options
const options = {
  ca: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')) // only required because we are using self-signed certificate
}

// define the message to send
let outboundMessage = "ping";

// create the client
const client = tls.connect(6000, options, function() {
  client.write(outboundMessage);
});

// when the server writes back, log what it says then kill the client
client.on("data", function(inboundMessage) {
  let messageString = inboundMessage.toString();
  console.log("I wrote "+outboundMessage+" and they said "+messageString);
  client.end();
})