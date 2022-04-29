/*
* Example TCP (Net) Client
* Connects to port 6000 and sends the word "ping" to server
*
*/

// Dependencies
const net = require("net");

// define the message to send
let outboundMessage = "ping";

// create the client
const client = net.createConnection({ "port": 6000 }, function() {
  client.write(outboundMessage);
});

// when the server writes back, log what it says then kill the client
client.on("data", function(inboundMessage) {
  let messageString = inboundMessage.toString();
  console.log("I wrote "+outboundMessage+" and they said "+messageString);
  client.end();
})