const dashboardRoute = require("./dashboard");
const lessonsRoute = require("./lessons");
const questionRoute = require("./question");
const profileRoute = require("./profile");
const loginRoute = require("./login-logout");
const signupRoute = require("./signup");

const constructorMethod = (app) => {
    app.use(dashboardRoute);
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
