/*
* Example UDP Server
* Creating a UDP datagram server listening on 6000
*
*/

// Dependencies
const dgram = require("dgram");


// create a server
const server = dgram.createSocket("udp4");

server.on("message", function(messageBuffer, sender) {
  // do something with an incoming message or do something with the sender
  let messageString = messageBuffer.toString();
  console.log(messageString);
});

// bind to 6000
server.bind(6000);