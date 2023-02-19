//
// config file
//
const PORT = process.env.PORT || 3000;
const URL = "http://localhost:" + PORT;

module.exports = {
    TEST_MODE: process.env.TEST === "true",
    PORT,
    URL,
    
    DIR: __dirname,
    CLIENT: __dirname + "/client",
    LOGS: __dirname + "/logs",
}