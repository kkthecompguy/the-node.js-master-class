/*
* Example TCP (Net) Server
* Listens to port 6000 and sends the word "pong" to client
*/

// Dependencies
const net = require("net");

// create server
const server = net.createServer(function(socket) {
  // send the word "pong"
  let outboundMessage = "pong";
  socket.write(outboundMessage);

  // when the client writes something, log it out
  socket.on("data", function(inboundMessage) {
    let messageString = inboundMessage.toString();
    console.log("I wrote "+outboundMessage+" and they said "+messageString)
  })
});

// listen
server.listen(6000);