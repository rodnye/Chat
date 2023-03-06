const config = require("../../config.js");
const {io} = require(config.DIR + "/server/server.js");
const auth = require(config.LOGIC + "/auth/authenticator.js");
const {
    User
} = require(config.LOGIC + "/database/dbh.js");
const client = require("./client/client.js");

io.of("/client").on("connection", async (socket) => {
    if (!socket.handshake.query) {
        socket.emit("alert", "EMPTY_TOKEN");
        socket.disconnect();
        return;
    }
    const token = socket.handshake.query.token;
    if (!token) {
        socket.emit("alert", "EMPTY_TOKEN")
        socket.disconnect();
        return;
    }
    const id = auth.verify(token);
    if (!id) {
        socket.emit("alert", "WRONG_TOKEN");
        socket.disconnect();
        return;
    }
    const user = await User.findOne({
        where: {
            user_id: id
        }
    });
    if (!user) {
        socket.emit("alert", "USER_NOT_FOUND");
        socket.disconnect();
        return;
    }

    if (io.sockets[id]) {
        io.sockets[id].emit("alert", "OTHER_CONNECT");
        io.sockets[id].disconnect();
        delete io.sockets[id];
    }
    io.sockets[id] = socket;
    // TODO
    // Add connect update

    client(io, socket, id);

    socket.on("disconnect", async (data) => {
        const _user = await User.findOne({
            where: {
                user_id: id
            }
        });
        // TODO 
        // Add disconect update
        delete io.sockets[id];
    });
});

module.exports = true;