const config = require("../../../config.js");
const {chat} = require("./chat");

const client = async (io, socket, id) => {
    await chat(io , socket , id);
};

module.exports = client;