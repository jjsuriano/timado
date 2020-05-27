// MAKE SOCKET CONNECTION
const socket = io.connect('http://localhost:3000');

// QUERY DOM
const form = document.getElementById("game-form")
const answers = document.getElementById("answers");
const answer = document.getElementById("answer");
const send = document.getElementById("send");
const gameName = document.getElementById("game-name");
const usersList = document.getElementById("users");

// EMIT EVENT
form.addEventListener("submit", (e) => {
    e.preventDefault();

    socket.emit("answer", {
        answer: answer.value
    });
    answer.value = "";
});


// GET NAME AND ROOM FROM URL
const {name, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.emit("joinRoom", {name, room});

// LISTEN FOR ANSWERS
socket.on("answer", (data) => {
    answers.innerHTML += "<p>" + data.name + ": " + data.answer + "</p>";

});

// LISTEN FOR USERS IN ROOM AND ROOM NAME
socket.on("roomUsers", ({room, users}) => {
    roomName(room);
    outputUsers(users);
})

// USER CONNECT AND DISCONNECT
socket.on("message", (data) => {
    console.log(data);
});


// HELPER FUNCTIONS
function roomName(room) {
    gameName.innerHTML = room;
}

function outputUsers(users) {
    usersList.innerHTML = `${users.map(user => `<li>${user.name}</li>`).join("")}`;
}