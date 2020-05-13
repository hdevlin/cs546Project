const express = require("express");
const lessons = require("../data/samples/lessons");
const router = express.Router();

router.get("/lessons", async (_, res) => {
    // TODO get all lessons from db
    res.render("layouts/lessons", { layout: false, reqbody: lessons });
});

router.get("/lesson/:id", async (req, res) => {
    // check if logged in
    if (!req.session.user) {
        res.redirect("/login");
        return;
    }
    let lessonObj = lessons.find((l) => l._id === req.params.id.toLowerCase());
    if (!lessonObj) res.status(404).json({ error: "Not found" });
    res.redirect(`/question/${lessonObj.questions[0]}`);
});

module.exports = router;
