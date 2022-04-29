/*
* Example UDP client
* sending a message to a UDP server on port 6000
*
*/

// Dependencies
const dgram = require("dgram");

// create the client
const client = dgram.createSocket("udp4");

// Define the message and pull it into a buffer
let messageString = "This is a message";
const messageBuffer = Buffer.from(messageString);


// send off the message
client.send(messageBuffer, 6000, "localhost", function(err, btyes) {
  console.log(btyes);
  client.close();
});