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
          expiresIn: 300, // token expires in 5 minutes
        });
        res.cookie("jwt", accessToken);

        if (payload.role == "donator") {
          return res.render("donate", {
            title: "Donate",
            user: "user", //check if this user attribute is neccessary throughout
          });
        }
        if (payload.role == "pantry") {
          return res.render("food", {
            title: "Available Foods",
            user: "user", //check if this user attribute is neccessary throughout
          });
        }
        if (payload.role == "admin") {
          return res.render("admin", {
            title: "Admin Panel",
            user: "user", //check if this user attribute is neccessary throughout
          });
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
  let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!accessToken) {
    return res.redirect("permissionDenied");
  }
  if (payload.role != "admin") {
    return res.redirect("permissionDenied");
  }
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (e) {
    res.status(401).send();
  }
};

exports.verifyPantry = function (req, res, next) {
  let accessToken = req.cookies.jwt;
  let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (payload.role == "admin" || payload.role == "pantry") {
    //check if this is correct the logic here.
    try {
      payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      next();
    } catch (e) {
      res.status(401).send();
    }
  } else {
    return res.redirect("permissionDenied");
  }
};
