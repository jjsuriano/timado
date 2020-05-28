const users = [];

const questions = [
    "¿Si [] fuera una pupusa, qué tipo fuera?", 
    "¿Qué profesión fue [] en su vida anterior?", 
    "¿Qué tema no hay que hablar con []?", 
    "En cenas familiares []...", 
    "Escribe una palabra que describa a [].",
    "Escribe un articulo que siempre está en la maleta de [] cuando viaja.", 
    "¿Si le dieras un regalo a [], que le dieras?", 
    "¿Cuál es el talento secreto de []?",
]

// JOIN USER IN GAME
function joinUser(id, name, room, score, answer, roundScore, ready) { 
    const user = { id, name, room, score, answer, roundScore, ready};
    users.push(user);
    return user;
}

function addAnswer(id, answer) {
   const user = users.find(user => user.id == id);
   user.answer = answer;
   return user;
}

function getAnswersFromRoom(room) {
    const usersRoom =  users.filter(user => user.room === room);
    let answers = [];
    for (let i=0; i<usersRoom.length; i++){
        let ans = usersRoom[i].answer;
        if (ans !== "") {
            answers.push({
                answer: usersRoom[i].answer, 
                id: usersRoom[i].id,
            });
        }
    }
    return answers;
}

function generateQuestion(room) {
    let question = questions[Math.floor(Math.random() * (questions.length))];
    const players = users.filter(user => user.room === room)
    const player = players[Math.floor(Math.random() * (players.length))].name;
    question = question.replace("[]", player);

    for (let i=0; i<players.length; i++) {
        players[i].ready = 0;
    }

    return question;
}

function scoreCounter(room) {
    const usersRoom =  users.filter(user => user.room === room);
    let c = 0;
    for (let i=0; i<usersRoom.length; i++){
        c += usersRoom[i].roundScore;
    }
    return c;
}

function isFirstConnection() {
    return users[0];
}

function updateTotalScores(users) {
    let roundResults = [];
    for (let i=0; i<users.length; i++) {
        let user = getCurrentUser(users[i]);
        roundResults.push({
            id: user.id, 
            score: user.roundScore,
        });
        user.score += user.roundScore;
        user.roundScore = 0;
    }
    return roundResults;
}

// GET THE CURRENT USER WITH ID
function getCurrentUser(data) {
    return users.find(user => user.id === data.id);
}

function userReady(data) {
    const player = users.find(user => user.id === data);
    player.ready = 1;
}

function readyCounter(room) {
    const usersRoom =  users.filter(user => user.room === room);
    let c = 0;
    for (let i=0; i<usersRoom.length; i++){
        c += usersRoom[i].ready;
    }
    return c;
}

// GET THE CURRENT USER AND REMOVE IT FROM THE ARRAY
function userLeft(id){
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// GET ALL THE USERS IN THE ROOM
function getRoomInfo(room) {
    return users.filter(user => user.room === room);
}

function updateRoundScore(data) {
    const user = users.find(user => user.id === data.id);
    user.roundScore += 1;
    return user;
}

module.exports = {
    joinUser, 
    userLeft, 
    getRoomInfo,
    addAnswer,
    getAnswersFromRoom, 
    getCurrentUser,
    updateRoundScore, 
    scoreCounter, 
    updateTotalScores, 
    generateQuestion,
    isFirstConnection, 
    userReady,
    readyCounter
};