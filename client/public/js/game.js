// MAKE SOCKET CONNECTION
const socket = io.connect('http://localhost:4000');


// QUERY DOM
let answers = document.getElementById("answers");
let answer = document.getElementById("answer");
let send = document.getElementById("send");

// EMIT EVENT
send.addEventListener("click", () => {
    socket.emit("answer", {
        answer: answer.value
    });
    answer.value = "";
});

// LISTEN FOR EVENTS
socket.on("answer", (data) => {
    console.log(data.answer)
    answers.innerHTML += "<p>" + data.answer + "</p>";
});