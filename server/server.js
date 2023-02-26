/********************
* Server Main File *
********************/

/**************
*   Config   *
**************/
const config = require("../config.js");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const https = require("https");
const fs = require("fs");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        method: ["POST", "GET"]
    }
});

const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser());

app.get("/", (req, res) => res.sendFile(config.CLIENT + "/index.html"));
app.use("/public", express.static(config.CLIENT)); //statics files
app.use("/node_modules", express.static(config.DIR + "/node_modules"));

module.exports = {
    io,
    app
};
const router = require(config.LOGIC + "/router.js");
app.use("/", router);

//Error route
app.use((req, res) => {
    res.json({
        status: false, message: "ERROR 404"
    });
});

server.listen(config.PORT, (log) => console.log("Server running on port:" + config.PORT));


// Call to socket module.
require(config.LOGIC + "/socket.js");