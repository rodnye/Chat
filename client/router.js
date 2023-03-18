
const path = require("path");
const config = require("../config.js");

const router = {
    src: path.join(config.DIR, "/client/src"),
    dist: path.join(config.CLIENT),
    url: "/public",
    
    onload: "main()",
    externalFiles: [
        ["css", "/node_modules/@fortawesome/fontawesome-free/css/all.min.css"],
        ["css", "/node_modules/bootstrap/dist/css/bootstrap-utilities.min.css"],
        
        ["js", "/node_modules/eruda/eruda.js", "eruda.init()"],
        ["js", "/node_modules/socket.io/client-dist/socket.io.min.js"],
        ["js", "/node_modules/eventemitter3/dist/eventemitter3.umd.min.js"],
    ]
}

module.exports = router;