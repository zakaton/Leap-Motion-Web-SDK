// A basic Socket.IO broadcaster

// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

// Routing
app.use(express.static('public'));

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


// Messages
const sockets = [];

io.on("connection", socket => {
    console.log("connected");
    sockets.push(socket);
    
    socket.on("disconnect", () => {
        console.log("disconnected");
        sockets.splice(sockets.indexOf(socket), 1);
    });

    socket.on("join", message => {
        console.log(`socket ${socket.id} joined channel ${message.channel}`);
        socket.join(message.channel);
    });

    socket.on("message", message => {
        io.to(message.channel).emit("message", message);
    });
});