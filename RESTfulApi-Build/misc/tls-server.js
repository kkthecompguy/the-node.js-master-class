/*
* Example TLS Server
* Listens to port 6000 and sends the word "pong" to client
*/

// Dependencies
const tls = require("tls");
const fs = require("fs");
const path = require("path");


// server options
const options = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}

// create server
const server = tls.createServer(options, function(socket) {
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