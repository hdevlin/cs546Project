const express = require("express");
const users = require("../data/users");
const lessons = require("../data/lessons");
const badges = require("../data/badges");
const bcrypt = require("bcrypt");
const router = express.Router();
const { ERRORS } = require("../data/common");
async function updateUserObject(userObj) {
    // change ids to objects
    for (var i in userObj["lessons"]) {
        try {
            const gotLesson = await lessons.getLesson(userObj["lessons"][i]);
            userObj["lessons"][i] = gotLesson;
        } catch (error) {
            console.log(`Error Getting Lesson: ${e}`);
        }
    }
    for (var i in userObj["completedLessons"]) {
        try {
            const gotLesson = await lessons.getLesson(
                userObj["completedLessons"][i]
            );
            userObj["completedLessons"][i] = gotLesson;
        } catch (e) {
            console.log(`Error Getting Completed Lesson: ${e}`);
        }
    }
    for (var i in userObj["badges"]) {
        try {
            const gotBadge = await badges.getBadge(userObj["badges"][i]);
            userObj["badges"][i] = gotBadge;
        } catch (e) {
            console.log(`Error Getting Badge: ${e}`);
        }
    }
    return userObj;
}

router.get("/login", async (_, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    // attempt to login user with provided credentials
    if (
        !req.body["email"] ||
        !req.body["password"] ||
        req.body["email"].trim() === "" ||
        req.body["password"].trim() === ""
    ) {
        res.status(401).render("login", {
            errorMsg: "Invalid login",
        });
    } else {
        let gotUser;
        try {
            gotUser = await users.getUserByEmail(req.body["email"]);
        } catch (e) {
            if (e == ERRORS.NOEXIST) {
                // access denied
                res.status(401).render("login", {
                    errorMsg: "Invalid login",
                });
                return;
            } else {
                console.log(`Error Getting User: ${e}`);
            }
        }

        let passMatch;
        try {
            passMatch = await bcrypt.compare(
                req.body["password"],
                gotUser.hashedPassword
            );
        } catch (err) {
            console.log(`Error when checking password: ${err}`);
        }

        if (passMatch) {
            // create cookie, set expiration, redirect
            let expiresIn = new Date();
            expiresIn.setHours(expiresIn.getHours() + 1);
            req.session.user = await updateUserObject(gotUser);
            req.session.cookie.expires = expiresIn;
            console.log(`User ${gotUser.email} logged in`);
            res.redirect("/");
            return;
        }
    }
});

router.get("/logout", (req, res) => {
    // destroy session & redirect
    let userEmail = req.session.user.email;
    req.session.destroy();
    console.log(`User ${userEmail} logged out`);
    res.redirect("/");
});

module.exports = router;
