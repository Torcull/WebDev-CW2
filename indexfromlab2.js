const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const public = path.join(__dirname, "public");
app.use(express.static(public));

app.get("/", function (req, res) {
  res.send("Hello! Welcome to my application.");
});

app.get("/about", function (req, res) {
  res.sendFile(path.join(public, "about.html"));
});

app.get("/guestbook", function (req, res) {
  res.send("<h1>Guestbook Messages</h1>");
});

app.use(function (req, res) {
  res.status(404);
  res.send("Sorry! Page not found.");
});

app.listen(port, () => {
  console.log("Server started on port " + port + ". Ctrl^ to quit.");
});
