// MAKE SOCKET CONNECTION
const socket = io.connect('http://localhost:3000');

// QUERY DOM
const form = document.getElementById("game-form")
const answers = document.getElementById("answers-form");
const answer = document.getElementById("answer");
const send = document.getElementById("send");
const gameName = document.getElementById("game-name");
const usersList = document.getElementById("users");

const autoMsg = "automatedMsg";

// EMIT EVENT
form.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("answer", {
        answer: answer.value
    });
    answer.value = "";
    // Hide input and submit button to prevent user editing their answer
    answer.hidden = true;
    send.hidden =true;
});

answers.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("logAnswer", {
        id: e.submitter.value,
    });
    answers.innerHTML = "";
    answers.hidden = true;
});

// GET NAME AND ROOM FROM URL
const {name, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.emit("joinRoom", {name, room});

// LISTEN FOR ANSWERS
socket.on("answers", (data) => {
    answers.hidden = false;
    printAnswers(data);
});

// LISTEN FOR USERS IN ROOM AND ROOM NAME
socket.on("roomUsers", ({room, users}) => {
    roomName(room);
    outputUsers(users);
})

// USER CONNECT AND DISCONNECT
socket.on(autoMsg, (data) => {
    console.log(data);
});

socket.on("start", () => {
    answer.hidden = false;
    send.hidden = false;
});

// HELPER FUNCTIONS
function roomName(room) {
    gameName.innerHTML = room;
}

function outputUsers(users) {
    usersList.innerHTML = `${users.map(user => `<li>${user.name} ${user.score}</li>`).join("")}`;
}

function printAnswers(answersList) {
    let html = "";
    for(let i=0; i<answersList.length; i++) {
        console.log(socket.id);
        if (answersList[i].id !== socket.id) {
            html += `<button type="submit" class="answer-btn" value="${answersList[i].id}">${answersList[i].answer}</button>`;
        } 
    }
    answers.innerHTML = html;
}