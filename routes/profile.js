const express = require("express");
const router = express.Router();

router.get("/profile", async (req, res) => {
    if (req.session.user) {
        res.render("layouts/profile", {
            layout: false,
            reqbody: req.session.user,
        });
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
