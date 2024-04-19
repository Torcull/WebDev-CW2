const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.login = function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  userModel.lookup(username, function (err, user) {
    if (err) {
      console.log("error finding upuser", err);
      return res.status(401).send();
    }
    if (!user) {
      console.log("User ", username, " not found.");
      return res.status(401).send();
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let payload = { username: user.usernam };
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
        res.cookie("jwt", accessToken);
        next();
      } else {
        return res.status(403).send();
      }
    });
  });
};

exports.verify = function (req, res, next) {
  let accessToken = req.cookiers.jwt;
  if (!accessToken) {
    return res.status(403).send();
  }
  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (e) {
    res.status(401).send();
  }
};
