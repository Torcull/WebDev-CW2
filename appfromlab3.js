const sqlite3 = require("sqlite3").verbose();

const express = require("express");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

let db = new sqlite3.Database(
  "./database/users.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    } else console.log("Connected to the employees database.");
  }
);

db.run("CREATE TABLE IF NOT EXISTS user(id TEXT, name TEXT)");
//Insert
app.post("/add", function (req, res) {
  db.serialise(() => {
    db.run("INSERT INTO user(id,name) VALUES(?,?");
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/register.html"));
});

app.post("/add", function (req, res) {
  db.serialize(() => {
    db.run("INSERT INTO username");
  });
});

app.listen(3000, () => {
  console.log("Server listening on port: 3000");
});
