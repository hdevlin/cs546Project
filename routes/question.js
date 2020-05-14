const express = require("express");
const questions = require("../data/questions");
const lessons = require("../data/lessons");
const router = express.Router();

router.get("/question/:id", async (req, res) => {
    // check if logged in
    if (!req.session.user) {
        res.redirect("/login");
        return;
    }
    const gotQuestion = await questions.getQuestion(req.params.id.toLowerCase());
    if (!gotQuestion) {
        res.status(404).json({ error: "Not found" });
        return;
    }
    const gotLesson = await lessons.getLesson(gotQuestion.lesson_id);
    let qReqBody = {
        lessonTitle: gotLesson.title,
        questions: gotLesson.questions,
        curQuestion: gotQuestion,
    };
    res.render("layouts/question", { layout: false, reqbody: qReqBody });
});

router.post("/question", async (req, res) => {
    // add completed question id to user object & update db
    console.log(req.body);
    res.redirect("/question");
});

module.exports = router;
