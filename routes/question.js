const express = require("express");
const xss = require("xss");
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
    res.render("question", {
        reqbody: JSON.parse(xss(JSON.stringify(qReqBody)))
    });
});

router.post("/question", async (req, res) => {
    // update db with completed question id
    if (!req.body.completedQuestion) return;
    const updatedUser = await users.updateCompletedQuestion(req.session.user._id.toString(), req.body.completedQuestion);
    req.session.user = updatedUser;
    res.redirect("#");
});

module.exports = router;
