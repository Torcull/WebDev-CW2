const express = require("express");
const router = express.Router();
const controller = require("../controllers/pantryController");
const { login } = require("../auth/auth");
const { verify } = require("../auth/auth");

router.get("/login", controller.login_page);
router.post("/login", login, controller.loggedIn_landing);
router.get("/logout", controller.logout);
router.get("/donate", verify, controller.donate);
router.get("/", controller.landing_page);
router.get("/foods", verify, controller.foods);
router.get("/foods/:donatorname", controller.show_donator_foods);
router.get("/apples", controller.apples);
router.get("/loggedIn", verify, controller.loggedIn_landing);
router.post("/donate", controller.post_donation);
router.get("/register", controller.register_page);
router.post("/register", controller.post_new_user);
router.get("/registerToAccess", controller.register_to_access);
router.get("/incorrectLogin", controller.incorrect_login);
router.get("/about", controller.about);
router.get("/contact", controller.contact_page);
router.post("/contact", controller.post_contact);

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
