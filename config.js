//
// config file
//
const PORT = process.env.PORT || 3000;
const URL = "http://localhost:" + PORT;
const URLDB = "mongodb://rrodnyestrada1:EWo4x8c6Jj3SwCaB@cluster0.r7gu9fw.mongodb.net/?retryWrites=true&w=majority";

module.exports = {
    TEST_MODE: process.env.TEST === "true",
    PORT,
    URL,
    URLDB,
    DIR: __dirname,
    CLIENT: __dirname + "/client",
    LOGS: __dirname + "/logs",
}