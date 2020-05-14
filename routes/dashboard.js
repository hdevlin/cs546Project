const xss = require("xss");

const lessons = require("../data/lessons");
const badges = require("../data/badges");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    let userObj = null;
    if (req.session.user) {
        userObj = req.session.user;
        for (var i in userObj["lessons"]) {
            try {
                const gotLesson = await lessons.getLesson(
                    userObj["lessons"][i]._id.toString()
                );
                userObj["lessons"][i] = gotLesson;
            } catch (e) {
                console.log(`Error Getting Lesson: ${e}`);
            }
        }
        for (var i in userObj["completedLessons"]) {
            try {
                const gotLesson = await lessons.getLesson(
                    userObj["completedLessons"][i]._id.toString()
                );
                userObj["completedLessons"][i] = gotLesson;
            } catch (e) {
                console.log(`Error Getting Completed Lesson: ${e}`);
            }
        }
        for (var i in userObj["badges"]) {
            try {
                const gotBadge = await badges.getBadge(
                    userObj["badges"][i]._id.toString()
                );
                userObj["badges"][i] = gotBadge;
            } catch (e) {
                console.log(`Error Getting Badge: ${e}`);
            }
        }
    }
    res.render("dashboard", {
        reqbody: JSON.parse(xss(JSON.stringify(userObj))),
    });
});

module.exports = router;
