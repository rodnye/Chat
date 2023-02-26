const config = require("../../../config.js");
const {
    Sequelize,
    Model,
    DataTypes,
    Op
} = require("sequelize");
const UserModel = require("./models/user.js");


/***********************
* Starting Connection *
***********************/
const sequelize = new Sequelize(config.USERDB, config.USERDB, config.PASSDB, {
  dialect: 'mysql',
  host: config.URLDB,
  dialectOptions: {
    
  }
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
        const rows = _rows;
        let ret = {};
        for (let row of rows) {
            if (this[row]) {
                try {
                    ret[row] = JSON.parse(this[row]);
                } catch (err) {
                    ret[row] = this[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this[o] == undefined) continue;
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

//Exporting Class Models
module.exports = {
    User
};