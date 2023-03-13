
const router = {
    onload: "main()",
    ignoreFiles: [
        "client/src/index.html"
    ],
    externalDependencies: [
        ["js", "/node_modules/eruda/eruda.js", "eruda.init()"],
        ["css", "/node_modules/bootstrap/dist/css/bootstrap-utilities.min.css"],
        ["css", "/node_modules/@fortawesome/fontawesome-free/css/all.min.css"],
        ["js", "/node_modules/socket.io/client-dist/socket.io.min.js"],
        ["js", "/node_modules/eventemitter3/umd/eventemitter3.min.js"],
    ]
}

module.exports = router;