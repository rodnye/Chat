//
// config file
//
const PORT = process.env.PORT || 3000;
const URL = "http://localhost:" + PORT;
const URLDB = "sql9.freemysqlhosting.net";

module.exports = {
    TEST_MODE: process.env.TEST === "true",
    PORT,
    URL,
    URLDB,
    USERDB: "sql9600823",
    PASSDB: "HFjvGfYAPb",
    PORTDB: "3306",
    DIR: __dirname,
    CLIENT: __dirname + "/client",
    LOGIC: __dirname + "/server"
    LOGS: __dirname + "/logs",
}