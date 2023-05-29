const config = require("../../../config.js");
const {
    Sequelize,
    Model,
    DataTypes,
    Op
} = require("sequelize");
const UserModel = require("./models/user.js");
const RoomModel = require("./models/room.js");
const MessageModel = require("./models/message.js");


/***********************
* Starting Connection *
***********************/
const sequelize = new Sequelize(config.DB, config.USERDB, config.PASSDB, {
    dialect: 'mysql',
    host: config.URLDB,
    dialectOptions: {},
    logging: false
});

(async () => {
    try {
        sequelize.authenticate();
    } catch (err) {
        throw new Error("" + err)
    }
})();


/**********************
*  User Model Class  *
**********************/
class User extends Model {
    getData(_rows) {
        const rows = (typeof(_rows) != "object" ? ( !_rows ? Object.keys(this.dataValues) : [_rows]): _rows);
        let ret = {};
        for (let row of rows) {
            if (this.dataValues[row]) {
                try {
                    ret[row] = JSON.parse(this.dataValues[row]);
                } catch (err) {
                    ret[row] = this.dataValues[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this.dataValues[o] == undefined) continue;
            parsedObj[o] = (typeof(obj[o]) === "object" ? JSON.stringify(obj[o]): obj[o]);
        }
        try {
            await this.update(parsedObj);
            return true;
        } catch (err) {
            console.err(err);
            return false;
        }
    }
}

User.init(
    UserModel(DataTypes),
    {
        sequelize
    }
);

(async () => {
    await User.sync();
})();

/*******************
* Modelo de Rooms *
*******************/

class Room extends Model {
    getData() {
        const rows = ["chat_id",
            "type",
            "pic",
            "gType",
            "link",
            "name",
            "desc",
            "bgColor",
            "textColor",
            "owner",
            "admins",
            "members",
            "banList",
            "bots",
            "pinned"];

        let ret = {};
        for (let row of rows) {
            if (this.dataValues[row] != undefined) {
                try {
                    ret[row] = JSON.parse(this.dataValues[row]);
                } catch (err) {
                    ret[row] = this.dataValues[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this.dataValues[o] == undefined) continue;
            parsedObj[o] = (typeof(obj) === "object" ? JSON.stringify(obj[o]): obj[o]);
        }
        try {
            await this.update(parsedObj);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
};


Room.init(
    RoomModel(DataTypes),
    {
        sequelize
    }
);

(async () => {
    await Room.sync();

    if (! (await Room.findOne({
        where: {
            chat_id: 0
        }}))) {
        const gchat = await Room.create({
            chat_id: 0,
            type: "group",
            link: "global1",
            name: "Global",
            desc: "Chat global.",
            owner: 0
        });
        
        const achat = await Room.create({
            chat_id: 1,
            type: "group",
            link: "admin1",
            name: "Admin",
            desc: "Chat Administration.",
            owner: 0
        });
    }
})();



/***********************
* Modelo de Mensajes *
**********************/

class Message extends Model {
    getData() {
        const rows = ["mess_id",
            "user_id",
            "user_nick",
            "user_color",
            "chat_id",
            "type",
            "reply",
            "shared",
            "isEdited",
            "isBot",
            "receivedBy",
            "seenBy",
            "message",
            "inline",
            "keyboard",
            "date"];
        let ret = {};
        for (let row of rows) {
            if (this.dataValues[row] != undefined) {
                try {
                    ret[row] = JSON.parse(this.dataValues[row]);
                } catch (err) {
                    ret[row] = this.dataValues[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this.dataValues[o] == undefined) continue;
            parsedObj[o] = (typeof(obj) == "object" ? JSON.stringify(obj[o]): obj[o]);
        }
        try {
            await this.update(parsedObj);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

Message.init(
    MessageModel(DataTypes),
    {
        sequelize
    }
);


(async () => {
    await Message.sync();
})();


module.exports = {
    User,
    Room,
    Message,
    Op
}