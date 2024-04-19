const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.login = function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  userModel.lookup(username, function (err, user) {
    if (err) {
      console.log("error finding user", err);
      return res.status(401).send();
    }
    if (!user) {
      return res.redirect("incorrectLogin");
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let payload = { username: user.username };
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
        res.cookie("jwt", accessToken);
        next();
      } else {
        return res.redirect("incorrectLogin");
      }
    });
  });
};

exports.verify = function (req, res, next) {
  let accessToken = req.cookies.jwt;
  if (!accessToken) {
    return res.redirect("registerToAccess");
  }
  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (e) {
    res.status(401).send();
  }
};
