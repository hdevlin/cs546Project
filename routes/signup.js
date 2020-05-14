const express = require("express");
const bcrypt = require("bcrypt");
const users = require("../data/users");
const { ERRORS } = require("../data/common");
const saltRounds = 10;
const router = express.Router();

router.post("/signup", async (req, res) => {
    // create a new account with provided details
    if (
        !req.body["name"] ||
        !req.body["email"] ||
        !req.body["password"] ||
        req.body["name"].trim() === "" ||
        req.body["email"].trim() === "" ||
        req.body["password"].trim() === ""
    ) {
        res.status(401).render("login", {
            errorMsg:
                "Could not create your account. Check the entered info and try again.",
        });
    } else {
        // generate hash
        // This is not being used currently
        let passHash;

        try {
            passHash = await bcrypt.hash(
                req.body["password"],
                await bcrypt.genSalt(saltRounds)
            );
        } catch (error) {
            console.log(`Error when hashing password: ${error}`);
        }

        // update db
        let gotUser = null;
        try {
            gotUser = await users.getUserByEmail(
                req.body["email"].toLowerCase()
            );
            if (gotUser) {
                res.status(401).render("login", {
                    errorMsg:
                        "Could not create your account. User already exists.",
                });
                return;
            }
        } catch (e) {
            if (e == ERRORS.NOEXIST) {
                // user does not exist
                await users.addUser(
                    req.body["name"],
                    req.body["email"],
                    passHash
                );
            }
        }

        res.render("login", {
            successMsg: "Account created! Now, log in.",
        });
        console.log(`User ${req.body.email} signed up`);
    }
});

module.exports = router;
