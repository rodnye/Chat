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
    DB: "sql10613295",
    USERDB: "sql10613295",
    PASSDB: "gsdmsnChNr",
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