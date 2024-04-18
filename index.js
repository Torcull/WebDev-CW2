const express = require("express");
const path = require("path");
const port = 3000;
const app = express();
const router = require("./routes/routes");
const mustache = require("mustache-express");

const public = path.join(__dirname, "public");
const bodyParser = require("body-parser");

app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.engine("mustache", mustache());
app.set("view engine", "mustache");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(public));

app.use("/", router);

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "./public")));
app.listen(port, () => {
  console.log("Server listening on Port: " + port);
});
