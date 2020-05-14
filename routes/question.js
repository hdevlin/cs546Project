const express = require("express");
const xss = require("xss");
const questions = require("../data/questions");
const lessons = require("../data/lessons");
const users = require("../data/users");
const router = express.Router();
const { ERRORS } = require("../data/common");
router.get("/question/:id", async (req, res) => {
    // check if logged in
    if (!req.session.user) {
        res.redirect("/login");
        return;
    }

    let gotQuestion;
    try {
        gotQuestion = await questions.getQuestion(req.params.id.toLowerCase());
    } catch (error) {
        if (error == ERRORS.NOEXIST) {
            res.status(404).json({ error: "Not found" });
            return;
        } else {
            console.log(`Error getting question: ${error}`);
        }
    }

    let gotLesson;
    try {
        gotLesson = await lessons.getLesson(gotQuestion.lesson_id);
    } catch (error) {
        console.log(`Error getting Lesson: ${error}`);
    }

    const qReqBody = {
        lessonTitle: gotLesson.title,
        questions: gotLesson.questions,
        curQuestion: gotQuestion,
    };
    res.render("question", {
        reqbody: JSON.parse(xss(JSON.stringify(qReqBody))),
    });
});

router.post("/question", async (req, res) => {
    // update db with completed question id
    if (!req.body.completedQuestion) return;
    try {
        const updatedUser = await users.updateCompletedQuestion(
            question,
            req.body.completedQuestion
        );
        req.session.user = updatedUser;
    } catch (error) {
        console.log(`Error updating completed question: ${error}`);
    }
    res.redirect("#");
});

module.exports = router;
