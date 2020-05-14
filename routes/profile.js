const express = require("express");
const xss = require("xss");

const router = express.Router();
const readUser = require("./common/readUser");
router.get("/profile", async (req, res) => {
    let userObj;
    try {
        userObj = await readUser(req.session.user);
    } catch (error) {
        console.log(`Error reading user: ${error}`);
    }

    if (userObj) {
        res.render("profile", {
            reqbody: JSON.parse(xss(JSON.stringify(userObj))),
            title: "Quizzo - Profile",
        });
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
