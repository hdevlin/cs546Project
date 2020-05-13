const express = require("express");
const lessons = require("../data/samples/lessons");
const questions = require("../data/samples/questions");
const router = express.Router();

router.get("/question/:id", async (req, res) => {
    // check if logged in
    if (!req.session.user) {
        res.redirect("/login");
        return;
    }
    // TODO retrieve question from db
    let questionObj = questions.find(
        (q) => q._id === req.params.id.toLowerCase()
    );
    if (!questionObj) res.status(404).json({ error: "Not found" });
    let lessonObj = lessons.find(
        (l) => l._id === questionObj.lesson_id.toLowerCase()
    );
    let qReqBody = {
        lessonTitle: lessonObj.title,
        questions: lessonObj.questions,
        curQuestion: questionObj,
    };
    res.render("layouts/question", { layout: false, reqbody: qReqBody });
});

router.post("/question", async (req, res) => {
    // add completed question id to user object & update db
    console.log(req.body);
    res.redirect("/question");
});

module.exports = router;
