const express = require("express");
const lessons = require("../data/lessons");
const badges = require("../data/badges");
const questions = require("../data/questions");
const router = express.Router();

router.get("/lessons", async (_, res) => {
    let gotLessons = await lessons.getAllLessons();
    let badgesObjs = [];
    for (var i in gotLessons) {
        for (var b in gotLessons[i].badges) {
            const gotBadge = await badges.getBadge(gotLessons[i].badges[b]);
            badgesObjs.push(gotBadge);
        }
        gotLessons[i].badges = badgesObjs;
    }
    res.render("layouts/lessons", { layout: false, reqbody: gotLessons });
});

router.get("/lesson/:id", async (req, res) => {
    // check if logged in
    if (!req.session.user) {
        res.redirect("/login");
        return;
    }
    let gotLesson = await lessons.getLesson(req.params.id.toLowerCase());
    if (!gotLesson) {
        res.status(404).json({ error: "Not found" });
        return;
    }
    let questionsObjs = [];
    let badgesObjs = [];
    for (var i in gotLesson.questions) {
        const gotQuestion = await questions.getQuestion(gotLesson.questions[i]);
        questionsObjs.push(gotQuestion);
    }
    for (var i in gotLesson.badges) {
        const gotBadge = await badges.getBadge(gotLesson.badges[i])
        badgesObjs.push(gotBadge);
    }
    gotLesson.questions = questionsObjs;
    gotLesson.badges = badgesObjs;
    res.redirect(`/question/${gotLesson.questions[0]._id.toString()}`);
});

module.exports = router;
