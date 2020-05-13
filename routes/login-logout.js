const express = require("express");
const users = require("../data/users");
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
        const gotUser = await users.getUserByEmail(req.body['email']);
        if (gotUser) {
            let passMatch;
            try {
                passMatch = await bcrypt.compare(
                    req.body["password"],
                    gotUser.hashedPassword
                );
            } catch (err) {
                console.log(err);
            }

            if (passMatch) {
                // create cookie, set expiration, redirect
                let expiresIn = new Date();
                expiresIn.setHours(expiresIn.getHours() + 1);
                req.session.user = gotUser;
                req.session.cookie.expires = expiresIn;
                console.log(`User ${gotUser.email} logged in`);
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
