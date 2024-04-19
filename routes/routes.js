const express = require("express");
const router = express.Router();
const controller = require("../controllers/pantryController");
const { login } = require("../auth/auth");
const { verify } = require("../auth/auth");

router.get("/login", controller.login_page);
router.post("/login", login, controller.handle_login);
router.get("/logout", verify, controller.logout);
router.get("/donate", verify, controller.donate);
router.get("/", controller.landing_page);
router.get("/foods", verify, controller.foods);
router.get("/foods/:donatorname", controller.show_donator_foods);
router.get("/register", controller.register);
router.get("/apples", controller.apples);

router.post("/donate", controller.post_donation);
router.get("/register", controller.register_page);
router.post("/register", controller.post_new_user);
router.post("/routeName", login, function (req, res) {}); //remove this when done

router.use(function (req, res) {
  res.status(404);
  res.type("text/plain");
  res.send("404 Not found.");
});

router.use(function (err, req, res, next) {
  res.status(500);
  res.type("text/plain");
  res.send("Internal Server Error.!!!");
  res.send(err);
});
module.exports = router;
