/***************
* Router File *
***************/

const config = require("../../config.js");
const router = require("express").Router();
const auth = require("./auth/router.js");

const index = async (req, res) => {
    await res.sendFile(config.CLI + "/index.html");
};

router.get("/", index);
router.use("/auth", auth);

module.exports = router;