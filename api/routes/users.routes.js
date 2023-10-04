var express = require("express");
var router = express.Router();
const usersController = require("../controllers/users.controller");

router.route("/sign-up").post(usersController.signUp);
router.route("/sign-in").post(usersController.signIn);

module.exports = router;
