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
        let payload = { username: user.username, role: user.role };
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 900, // token expires in 15 minutes
        });
        res.cookie("jwt", accessToken);

        if (payload.role == "donator") {
          return res.redirect("/donate");
        }
        if (payload.role == "pantry") {
          return res.redirect("/foods");
        }
        if (payload.role == "admin") {
          return res.redirect("/admin");
        }
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
  try {
    next();
  } catch (e) {
    res.status(401).send();
  }
};

exports.verifyAdmin = function (req, res, next) {
  let accessToken = req.cookies.jwt;
  if (!accessToken) {
    return res.redirect("/permissionDenied");
  }
  let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (payload.role != "admin") {
    return res.redirect("permissionDenied");
  }
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (e) {
    return res.redirect("permissionDenied");
  }
};

exports.verifyPantry = function (req, res, next) {
  let accessToken = req.cookies.jwt;
  if (!accessToken) {
    return res.redirect("/permissionDenied");
  }
  let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (payload.role == "admin" || payload.role == "pantry") {
    try {
      payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      next();
    } catch (e) {
      return res.redirect("/permissionDenied");
    }
  } else {
    return res.redirect("/permissionDenied");
  }
};
