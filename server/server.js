/**
 * Server
 */
 
const {
    TEST_MODE, 
    PORT, 
    URL, 
    CLIENT
} = require("../config.js");

const express = require("express");
const server = express();


// public client folder
server.use("/", express.static(CLIENT));

// start server
server.listen(PORT, () => {
    if (TEST_MODE) console.log(":::TEST_MODE enabled:::");
    console.log("Client running...", URL);
});

