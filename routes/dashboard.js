const xss = require("xss");

const readUser = require("./common/readUser");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    let userObj;
    try {
        userObj = await readUser(req.session.user);
    } catch (e) {
        console.log(`Error when Reading User: ${e}`);
    }

    res.render("dashboard", {
        reqbody: JSON.parse(xss(JSON.stringify(userObj))),
        title: "Quizzo - Dashboard",
    });
});

module.exports = router;
