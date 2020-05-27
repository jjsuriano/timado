const users = [];

// JOIN USER IN GAME
function joinUser(id, name, room, score, answer) { 
    const user = { id, name, room, score, answer };
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
            answers.push(usersRoom[i].answer);
        }
    }
    return answers;
}

// GET THE CURRENT USER WITH ID
function getCurrentUser(id) {
    return users.find(user => user.id === id);
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

module.exports = {
    joinUser, 
    getCurrentUser, 
    userLeft, 
    getRoomInfo,
    addAnswer,
    getAnswersFromRoom
};