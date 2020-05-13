const express = require("express");
const lessons = require("../data/lessons");
const badges = require("../data/badges");
const router = express.Router();

router.get("/profile", async (req, res) => {
    if (req.session.user) {
        let userObj = req.session.user;
        for (var i in userObj['lessons']) {
            const gotLesson = await lessons.getLesson(userObj['lessons'][i]);
            userObj['lessons'][i] = gotLesson;
        }
        for (var i in userObj['completedLessons']) {
            const gotLesson = await lessons.getLesson(userObj['completedLessons'][i]);
            userObj['completedLessons'][i] = gotLesson;
        }
        for (var i in userObj['badges']) {
            const gotBadge = await badges.getBadge(userObj['badges'][i]);
            userObj['badges'][i] = gotBadge;
        }
        res.render("layouts/profile", {
            layout: false,
            reqbody: userObj,
        });
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
