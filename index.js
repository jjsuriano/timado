// REQUIRE
const express = require("express");
const socket = require("socket.io");

// APP SETUP
const app = express();
const PORT = 4000;
const server = app.listen(PORT, () => {
    console.log(`Listening to requests on port ${PORT}...`);
});

// STATIC FILES
app.use(express.static('public'));

// SOCKET SETUP
const io = socket(server);

io.on("connection", (socket) => {
    console.log("Socket connection made");
    console.log("Users connected: " + socket.client.conn.server.clientsCount);
});