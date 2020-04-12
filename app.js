/* global __dirname */
const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

// set static dir
app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
    console.log("App starting");
    console.log("Routes now running on http://localhost:3000");
});
