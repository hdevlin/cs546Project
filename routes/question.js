const express = require("express");
const questions = require("../data/questions");
const lessons = require("../data/lessons");
const users = require("../data/users");
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
    // update db with completed question id
    await users.updateCompletedQuestion(req.session.user._id.toString(), req.body.completedQuestion);
    res.redirect("#");
});

module.exports = router;
