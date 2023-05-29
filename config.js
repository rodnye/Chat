//
// config file
//
const PORT = process.env.PORT || 3000;
const URL = "http://localhost:" + PORT;
const URLDB = "sql10.freemysqlhosting.net";

module.exports = {
    TEST_MODE: process.env.TEST === "true",
    PORT,
    URL,
    URLDB,
    DB: "sql10622054",
    USERDB: "sql10622054",
    PASSDB: "Mf46R9MqsE",
    PORTDB: "3306",
    DIR: __dirname,
    CLIENT: __dirname + "/client",
    LOGIC: __dirname + "/server/logic",
    LOGS: __dirname + "/logs",
    TOKEN: {
        secret: "testpasswordlol",
        expire: "24h"
    }
}