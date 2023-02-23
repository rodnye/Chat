//
// config file
//
const PORT = process.env.PORT || 3000;
const URL = "http://localhost:" + PORT;
const URLDB = "mongodb://localhost:27017/ssc";

module.exports = {
    TEST_MODE: process.env.TEST === "true",
    PORT,
    URL,
    URLDB,
    DIR: __dirname,
    CLIENT: __dirname + "/client",
    LOGS: __dirname + "/logs",
}