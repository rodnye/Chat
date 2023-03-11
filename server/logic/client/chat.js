/**/
const config = require("../../../config.js");
const uid = require(config.LOGIC + "/helpers/uid.js");
const DB = require(config.LOGIC + "/helpers/DB.js");
const {
    User,
    Room,
    Message,
    Op
} = require(config.LOGIC + "/database/dbh.js");

const chat = async (io, socket, id) => {
    const user = await User.findOne({
        where: {
            user_id: id
        }
    });
    const user_data = user.getData();
    let ncontacts = [];
    for (let c of user_data.contacts) {
        const con = await User.findOne({
            where: {
                user_id: c
            }
        });
        if (con) {
            const co = con.getData();
            ncontacts.push({
                user_id: co.user_id,
                nickname: co.nickname,
                color: co.color,
                statuses: co.statuses,
                email: co.email,
                pic: co.pic,
                desc: co.desc,
                isOnline: co.isOnline
            });
        }
    }
    user_data.contacts = ncontacts;
    await socket.emit("load-user", user_data);

    socket.on("get-room-data", async () => {
        let __r = [];
        for (let r of user_data.rooms) {
            const room = await Room.findOne({
                where: {
                    chat_id: r
                }
            });
            if (room) {
                const rm = room.getData();
                if (rm.owner != id && !rm.admins.includes(id)) {
                    delete rm.link;
                    delete rm.banList;
                }
                __r.push(rm);
                socket.join("" + r);
            }
        }
        socket.emit("get-room-data", __r);
    });

    socket.on("get-room-mess",
        async (data) => {
            
            if (!data || !Array.isArray(data)) return;
            
            let messages = [];
            for (let _m of data) {
                if (!_m.chat_id || !_m.date) continue;
                const mess = await Message.findAll({
                    where: {
                        [Op.and]: {
                            chat_id: _m.chat_id
                        },
                        [Op.and]: {
                            date: {
                                [Op.gt]: (_m.date == 0 ? new Date().getTime(): _m.date)
                            }
                        }
                    }
                });
                if (mess) {
                    messages = messages.concat(mess);
                }
            }
            socket.emit("get-room-mess", messages);
        });

    socket.on("message",
        async (data) => {
            if (!data.arriv_id || data.chat_id == undefined || !data.type || !data.message) return;
            const mess_id = uid.num(8);
            const room = await Room.findOne({
                where: {
                    chat_id: data.chat_id
                }
            });
            if (!room) return socket.emit("toast", "ROOM_NOT_FOUND");
            switch (data.type) {
                case "text":
                    if (data.message.length < 1 || data.message.length > 1000) return socket.emit("toast", "MESS_WRONG_LENGTH");
                    const mess = await Message.create({
                        mess_id: mess_id,
                        chat_id: data.chat_id,
                        type: data.type,
                        user_id: id,
                        user_nick: user_data.nickname,
                        user_color: user_data.color,
                        message: data.message,
                        reply: (!isNaN(data.reply) ? data.reply: null),
                        date: new Date().getTime()
                    });
                    if (mess) {
                        await socket.broadcast.in("" + data.chat_id).emit("message", mess.getData());
                      /*  console.log(io)
                        io.of("/client").emit("message", mess.getData());*/
           
                        for (let bot of room.bots) {
                            if (io.sockets[bot]) io.sockets[bot].emit("message", mess);
                        }
                        socket.emit("arriv-mess", {
                            arriv_id: data.arriv_id,
                            chat_id: data.chat_id,
                            mess_id: mess_id
                        });
                    }
                    break;
                default:
                    socket.emit("toast", "MESS_TYPE_NOT_FOUND");
                    break;
            }
        });

    socket.on("create-room",
        async (data) => {
            const chat_id = uid.num(12);
            const user = await User.findOne({
                where: {
                    user_id: id
                }
            }).getData();
            if (config.VIP[user.vip].max_own_groups <= user.own_rooms.length) return null;
            let mem = [id];
            if (!data.members) data.members = [];
            for (let m of members) {
                const memb = await User.findOne({
                    where: {
                        user_id: m
                    }
                })
                if (memb && memb.acceptInvitations) {
                    mem.push(m);
                }
            }
            const room = await Room.create({
                chat_id: chat_id,
                owner: id,
                name: data.name,
                desc: data.desc,
                link: "/xgp/" + uid.alphanum(16),
                pic: (data.pic ? data.pic: ""),
                members: (typeof(data.members) == "object" ? JSON.stringify(data.members): data.members),
                type: "group"
            });
            if (!room) return socket.emit("toast", "CANNOT_CREATE_ROOM");

            for (let m of room.members) {
                const membe = await User.findOne({
                    where: {
                        user_id: m
                    }
                });
                if (!membe) continue;
                let mm = membe.getData();
                mm.rooms.push(chat_id);
                membe.setData({
                    rooms: mm.rooms
                });
                if (io.sockets[m]) {
                    await io.sockets[m].join(chat_id);
                }
            }

            io.of("/client").to(chat_id).emit("new-room", room);
        });

    socket.on("start-pv",
        async (data) => {
            if (!data.user_id) return socket.emit("toast", "WRONG_DATA");
            const ouser = await User.findOne({
                where: {
                    user_id: data.user_id
                }
            });
            if (!ouser) return socket.emit("toast", "USER_NOT_FOUND");
            const _ouser = ouser.getData();
            if (ouser.banList.includes(id)) return socket.emit("toast", "USER_BANNED_U");
            const user = await User.findOne({
                where: {
                    user_id: id
                }
            });
            const _user = user.getData();
            const croom = await Room.findOne({
                where: {
                    [Op.and]: {
                        type: "private",
                        [Op.or]: [{
                            members: JSON.stringify([id, data.user_id])
                        }, {
                            members: JSON.stringify([data.user_id, id])
                        }]
                    }
                }
            });
            if (croom) return socket.emit("toast", "ROOM_EXISTS");
            const chat_id = id + data.user_id;
            const room = await Room.create({
                chat_id: chat_id,
                owner: id,
                name: "SYSTEM",
                desc: "SYSTEM",
                link: "/handler/" + uid.alphanum(32),
                pic: "",
                members: JSON.stringify([id, data.user_id]),
                type: "private"
            });
            if (!room) return socket.emit("toast", "UNEXPECTED_ERROR");
            _user.rooms.push(chat_id);
            _ouser.rooms.push(chat_id);

            user.setData({
                rooms: _user.rooms
            });

            ouser.setData({
                rooms: _ouser.rooms
            });

            socket.join(chat_id);
            if (data.chat_id) socket.emit("delete-off", {
                chat_id: data.chat_id
            });
            if (io.sockets[data.user_id]) io.sockets[data.user_id].join(chat_id);
            io.of("/client").to(chat_id).emit("new-pv", room.getData());
        });


    socket.on("find-room-from-link",
        async (link) => {
            const _room = await Room.findOne({
                where: {
                    link: link
                }
            });
            if (!_room) return socket.emit("bottomsheet", {
                status: false,
                data: "NOT_FOUND"
            });
            const room = _room.getData();

            socket.emit("bottomsheet", {
                status: true,
                data: {
                    chat_id: room.chat_id,
                    name: room.name,
                    desc: room.desc,
                    pic: room.pic,
                    owner: await User.findOne(room.owner).nickname,
                    members: room.members.length,
                    bgColor: room.bgColor,
                    textColor: room.textColor
                }
            })
        });

    socket.on("join-room",
        async (data) => {
            const room = await DB.joinRoom(id, data.chat_id);
            if (!room.status) return socket.emit("bottomsheet", room);

            socket.emit("new-room", room);
            await socket.join(room.chat_id);
            const mess_id = uid.num(8);

            const mess = await DB.newMess("SYSTEM", room.chat_id, mess_id, "text", user.name + " se ah unido al chat.");

            socket.to(room.chat_id).emit("joined", {
                user_id: id, room: room_chat_id
            });

            io.of("/client").to(room.chat_id).emit("message", mess);
        });

    socket.on("edit-mess",
        async (data) => {
            if (!data || !data.mess_id || !data.chat_id || data.message) return socket.emit("toast", "WRONG_DATA");
            const mess = await Message.findOne({
                where: {
                    chat_id: data.chat_id,
                    mess_id: data.mess_id
                }
            });
            if (!mess) return socket.emit("toast", "MESSAGE_NOT_FOUND");
            if (mess.message == data.message || data.message == " ") return;
            if (mess.user_id != id) return socket.emit("toast", "NOT_ENOUGHT_PRIVILEGIES");
            await mess.setData({
                message: data.message,
                edited: true
            });
            socket.to(data.chat_id).emit("edit-mess", mess.getData());
        });

    socket.on("del-mess",
        async (data) => {
            if (!data || !data.mess_id || !data.chat_id || data.message) return socket.emit("toast", "WRONG_DATA");
            const mess = await Message.findOne({
                where: {
                    chat_id: data.chat_id,
                    mess_id: data.mess_id
                }
            });
            if (!mess) return socket.emit("toast", "MESSAGE_NOT_FOUND");
            if (mess.message == data.message || data.message == " ") return;
            if (mess.user_id != id) return socket.emit("toast", "NOT_ENOUGHT_PRIVILEGIES");
            await mess.setData({
                message: "El mensaje ah sido eliminado.",
                edited: true
            });
            socket.to(data.chat_id).emit("del-mess", mess.getData());
        });

    socket.on("add-contact",
        async (data) => {

            const u = await User.findOne({
                where: {
                    user_id: id
                }
            });

            if (data == u.email) return socket.emit("add-contact", {
                status: false,
                data: "CANNOT_SELF_ADD"
            });

            const user = await User.findOne({
                where: {
                    email: data
                }
            });
            if (!user) return socket.emit("add-contact", {
                status: false,
                data: "USER_NOT_FOUND"
            });
            if (u.contacts.includes(user.user_id)) return socket.emit("add-contact", {
                status: false,
                data: "ALREADY_IN_CONTACTS"
            });

            const us = u.getData();
            us.contacts.push(user.user_id);
            try {
                await u.setData({
                    contacts: us.contacts
                });

                return socket.emit("add-contact", {
                    status: true,
                    data: {
                        user_id: user.user_id,
                        email: user.email,
                        nickname: user.nickname,
                        pic: user.pic,
                        desc: user.desc,
                        color: user.color,
                        statuses: user.statuses
                    }
                });
            } catch (err) {
                return socket.emit("add-contact", {
                    status: false,
                    data: "USER_NOT_FOUND"
                });
            }
        });

    socket.on("get-contact-data",
        async (user_id) => {
            const user = await User.findOne({
                where: {
                    user_id: id
                }
            });

            const o_user = await User.findOne({
                where: {
                    user_id: user_id
                }
            });

            if (!o_user) return socket.emit("error", "USER_NOT_FOUND");
            const u = user.getData();
            if (!u.contacts.includes(user_id)) return socket.emit("error", "NOT_IN_CONTACT");

            const _u = o_user.getData();
            socket.emit("get-contact-data", {
                user_id: _u.user_id,
                email: _u.email,
                nickname: _u.nickname,
                pic: _u.pic,
                desc: _u.desc,
                color: _u.color,
                statuses: _u.statuses
            });

        });



};

module.exports = chat;