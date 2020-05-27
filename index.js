// REQUIRE
const path = require("path");
const express = require("express");
const http = require("http")
const socket = require("socket.io");

const { joinUser, getCurrentUser,  userLeft, getRoomUsers } = require("./utils/users");

// APP SETUP
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// STATIC FILES
app.use(express.static(path.join(__dirname,"/client/public")));

// SOCKET SETUP
const io = socket(server);

io.on("connection", (socket) => {
    console.log("Socket connection made");
    console.log("Users connected: " + socket.client.conn.server.clientsCount + "\n");

    socket.on("joinRoom", ({ name, room }) => {
        const user = joinUser(socket.id, name, room);
        socket.join(user.room);

        socket.on("answer", (data) => {
            io.to(user.room).emit("answer", data);
        });
    
    
        socket.broadcast.to(user.room).emit("message", `${user.name} se acaba de unir al juego`);

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    socket.on("disconnect", () => {
        console.log("Socket connection closed");
        console.log("Users connected: " + socket.client.conn.server.clientsCount + "\n");
        const user = userLeft(socket.id);
        if (user) {
            io.to(user.room).emit("message", `${user.name} se acaba de desconectar`);
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

// SERVER

server.listen(PORT, () => {
    console.log(`Listening to requests on port ${PORT}...`);
});