// REQUIRE
const express = require("express");

// APP SETUP
const app = express();
const PORT = 4000;
const server = app.listen(PORT, () => {
    console.log(`Listening to requests on port ${PORT}...`);
});

// STATIC FILES
app.use(express.static('public'));