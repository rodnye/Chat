/**
 * Server
 */
 
const {
    TEST_MODE, 
    PORT, 
    URL, 
    URLDB,
    CLIENT
} = require("../config.js");

const express = require("express");
const server = express();
const mongoose = require("mongoose");

// public client folder
server.use("/", express.static(CLIENT));

// database conection
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
        
    console.log("Database online");
});

// start server
server.listen(PORT, () => {
    if (TEST_MODE) console.log(":::TEST_MODE enabled:::");
    console.log("Client running...", URL);
});

