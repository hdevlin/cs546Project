const express = require("express");
const users = require("../data/samples/users");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/login", async (_, res) => {
    res.render("login", { layout: false });
});

router.post("/login", async (req, res) => {
    // attempt to login user with provided credentials
    if (
        !req.body["email"] ||
        !req.body["password"] ||
        req.body["email"].trim() === "" ||
        req.body["password"].trim() === ""
    ) {
        res.status(401).render("login", {
            layout: false,
            errorMsg: "Invalid login",
        });
    } else {
        // TODO get users collection from database (maybe make a getUserByEmail function)
        let userObj = users.find(
            (user) =>
                user.email.toLowerCase() === req.body["email"].toLowerCase()
        );
        if (userObj) {
            let passMatch;
            try {
                passMatch = await bcrypt.compare(
                    req.body["password"],
                    userObj.hashedPassword
                );
            } catch (err) {
                console.log(err);
            }

            if (passMatch) {
                // create cookie, set expiration, redirect
                let expiresIn = new Date();
                expiresIn.setHours(expiresIn.getHours() + 1);
                req.session.user = userObj;
                req.session.cookie.expires = expiresIn;
                console.log(`User ${userObj.email} logged in`);
                res.redirect("/");
                return;
            }
        }
        // access denied
        res.status(401).render("login", {
            layout: false,
            errorMsg: "Invalid login",
        });
    }
});

router.get("/logout", (req, res) => {
    // destroy session & redirect
    let userEmail = req.session.user.email;
    req.session.destroy();
    console.log(`User ${userEmail} logged out`);
    res.redirect("/");
});

module.exports = router;
