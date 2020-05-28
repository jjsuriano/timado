// REQUIRE
const path = require("path");
const express = require("express");
const http = require("http")
const socket = require("socket.io");

const { joinUser,  userLeft, getRoomInfo, addAnswer, getAnswersFromRoom, 
updateRoundScore, scoreCounter, updateTotalScores, generateQuestion, 
isFirstConnection, readyCounter, userReady, getCurrentUser } = require("./utils/users");

// APP SETUP
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const autoMsg = "automatedMsg";

// STATIC FILES
app.use(express.static(path.join(__dirname,"/client/public")));

// SOCKET SETUP
const io = socket(server);

io.on("connection", (socket) => {
    console.log("Socket connection made");
    console.log("Total number of users connected: " + socket.client.conn.server.clientsCount + "\n");

    socket.on("joinRoom", ({ name, room }) => {
        const user = joinUser(socket.id, name, room, 0, "", 0, 1);
        socket.join(user.room);

        let currentRoom = io.sockets.adapter.rooms[user.room];
        console.log(`Number of users connected in ${user.room}: ` + currentRoom.length + "\n");

        let first = isFirstConnection();
        io.to(first.id).emit("VIP", first.id);

        // RECIEVE ANSWERS BY THE USERS
        socket.on("logAnswer", (id) => {
            // console.log(user.ready);
            updateRoundScore(id);

            console.log(id);
            io.to(user.id).emit("results", {
                psychedBy: getCurrentUser(id).name,
            });

            let count = scoreCounter(user.room);
            if (count == io.sockets.adapter.rooms[user.room].length) {
                let users = getRoomInfo(user.room);
                updateTotalScores(users);
                io.to(user.room).emit("roomUsers", {
                    room: user.room,
                    users: getRoomInfo(user.room),
                });
                
            }
        });

        socket.on("play", () => {
            io.to(user.room).emit("start", generateQuestion(user.room));
        });

        socket.on("again", () => {
            userReady(user.id);
            let count = readyCounter(user.room);
            if (count == io.sockets.adapter.rooms[user.room].length) {
                io.to(user.room).emit("start", generateQuestion(user.room));
            }
            
        });

        socket.on("answer", (data) => {
            addAnswer(user.id, data.answer);
            let answers = getAnswersFromRoom(user.room);
            if (answers.length == io.sockets.adapter.rooms[user.room].length) {
                io.to(user.room).emit("answers", answers);
                let users = getRoomInfo(user.room);
                for (let i=0; i<users.length; i++) {
                    users[i].answer = "";
                }
            }
            
        });
    
        // EMIT BROADCAST MESSAGE THAT USER JUST JOINED
        socket.broadcast.to(user.room).emit(autoMsg, `${user.name} se acaba de unir al juego`);

        // EMIT USERS AND ROOM NAME OF THE ROOM USER JOINED
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomInfo(user.room),
        });
    });

    

    // USER DISCONNECTS
    socket.on("disconnect", () => {
        console.log("Socket connection closed");
        console.log("Total number of users connected: " + socket.client.conn.server.clientsCount + "\n");
        const user = userLeft(socket.id);
        if (user) {
            io.to(user.room).emit(autoMsg, `${user.name} se acaba de desconectar`);
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomInfo(user.room),
            });
        }
    });
});

// SERVER
server.listen(PORT, () => {
    console.log(`Listening to requests on port ${PORT}...\n`);
});