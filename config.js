//
// config file
//

module.exports = {
    PORT: process.env.PORT || 3000,
    TEST_MODE: process.env.TEST === "true",
    
    DIR: __dirname,
    CLIENT: __dirname + "/client",
    LOGS: __dirname + "/logs",
}