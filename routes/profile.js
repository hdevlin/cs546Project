const express = require("express");
const xss = require("xss");
const lessons = require("../data/lessons");
const badges = require("../data/badges");
const router = express.Router();

router.get("/profile", async (req, res) => {
    if (req.session.user) {
        let userObj = req.session.user;
        for (var i in userObj['lessons']) {
            const gotLesson = await lessons.getLesson(userObj['lessons'][i]._id.toString());
            userObj['lessons'][i] = gotLesson;
        }
        for (var i in userObj['completedLessons']) {
            const gotLesson = await lessons.getLesson(userObj['completedLessons'][i]._id.toString());
            userObj['completedLessons'][i] = gotLesson;
        }
        for (var i in userObj['badges']) {
            const gotBadge = await badges.getBadge(userObj['badges'][i]._id.toString());
            userObj['badges'][i] = gotBadge;
        }
        res.render("layouts/profile", {
            layout: false,
            reqbody: JSON.parse(xss(JSON.stringify(userObj))),
        });
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
