const express = require("express");
const xss = require("xss");
const lessons = require("../data/lessons");
const badges = require("../data/badges");
const users = require("../data/users");
const questions = require("../data/questions");
const router = express.Router();
const { ERRORS } = require("../data/common");

router.get("/lessons", async (_, res) => {
    let gotLessons;
    try {
        gotLessons = await lessons.getAllLessons();
    } catch (e) {
        console.log(`Error Getting All Lessons: ${e}`);
    }

    let badgesObjs = [];
    for (var i in gotLessons) {
        for (var b in gotLessons[i].badges) {
            try {
                const gotBadge = await badges.getBadge(gotLessons[i].badges[b]);
                badgesObjs.push(gotBadge);
            } catch (e) {
                console.log(`Error getting badge: ${e}`);
            }
        }
        gotLessons[i].badges = badgesObjs;
        badgesObjs = [];
    }

    res.render("lessons", {
        reqbody: JSON.parse(xss(JSON.stringify(gotLessons))),
    });
});

router.get("/lesson/:id", async (req, res) => {
    // check if logged in
    if (!req.session.user) {
        res.redirect("/login");
        return;
    }
    let gotLesson;
    try {
        gotLesson = await lessons.getLesson(req.params.id.toLowerCase());
    } catch (e) {
        if (e == ERRORS.NOEXIST) {
            res.status(404).json({ error: "Not found" });
            return;
        } else {
            console.log(`Error Getting Lesson: ${e}`);
        }
    }

    let questionsObjs = [];
    let badgesObjs = [];
    for (var i in gotLesson.questions) {
        try {
            const gotQuestion = await questions.getQuestion(
                gotLesson.questions[i]
            );
            questionsObjs.push(gotQuestion);
        } catch (e) {
            console.log(`Error getting questions: ${e}`);
        }
    }
    for (var i in gotLesson.badges) {
        try {
            const gotBadge = await badges.getBadge(gotLesson.badges[i]);
            badgesObjs.push(gotBadge);
        } catch (e) {
            console.log(`Error getting badge: ${e}`);
        }
    }
    gotLesson.questions = questionsObjs;
    gotLesson.badges = badgesObjs;
    res.redirect(`/question/${gotLesson.questions[0]._id.toString()}`);
});

router.post("/lesson", async (req, res) => {
    // update db with removed lesson
    if (!req.body.dropLesson) return;
    console.log(req.body.dropLesson);
    try {
        const updatedUser = await users.updateRemovedLesson(
            req.session.user._id.toString(),
            req.body.dropLesson
        );
        console.log(updatedUser);
        req.session.user = updatedUser;
    } catch (e) {
        console.log(`Error Dropping Lesson: ${e}`);
    }
    res.redirect("/");
});

module.exports = router;
