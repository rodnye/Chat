const config = require("../../../config.js");
const {
    User
} = require(config.LOGIC + "/database/dbh.js");
const authenticator = require("./authenticator.js");
const bcrypt = require("bcryptjs");

/*functionlogin
  *@Method:POST
  *@paramreq{body:{username,password,app_token}}
  *@paramres{}
  */

const login = async (req, res) => {
    if (!req.body) return res.json({
        status: false, data: "NO_DATA"
    });
    let username,
    password;
    try {
        const body = req.body;
        username = body.username;
        password = body.password;
    } catch (err) {
        return res.json({
            status: false,
            data: "DATA_ERROR",
            error: err
        });
    }

    const account = await User.findOne({
        where: {
            username: username
        }
    });

    if (!account) {
        return res.json({
            status: false,
            data: "WRONG_USER"
        });
    }

    if (!account.verified) {
        return res.json({
            status: false,
            data: "ACC_NOT_VERIFIED",
            email: account.email
        });
    }


    if (!bcrypt.compareSync(password, account.password)) {
        return res.json({
            status: false,
            data: "WRONG_USER"
        });
    }

    return res.json({
        status: true,
        data: authenticator.generate(account.user_id)
    });
}

module.exports = login;