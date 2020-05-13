const lessonsRoute = require("./lessons");
const questionRoute = require("./question");
const profileRoute = require("./profile");
const loginRoute = require("./login-logout");
const signupRoute = require("./signup");
const lessons = require("../data/lessons");
const badges = require("../data/badges");

const constructorMethod = (app) => {
    app.get("/", async (req, res) => {
        let userObj = null;
        if (req.session.user) {
            userObj = req.session.user;
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
        }
        res.render("layouts/main", {
            layout: false,
            reqbody: userObj
        });
    });

    app.use(lessonsRoute);
    app.use(profileRoute);
    app.use(loginRoute);
    app.use(questionRoute);
    app.use(signupRoute);

    app.use("*", (_, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;
