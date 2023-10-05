var express = require("express");
var router = express.Router();

const validate = require("../middlewares/validator-error.middleware");
const usersValidation = require("../validations/users.validation");

const usersController = require("../controllers/users.controller");
const userAuth = require("../middlewares/userAuth.middleware");

router
  .route("/sign-up")
  .post(validate(usersValidation.signUp), usersController.signUp);

router
  .route("/sign-in")
  .post(validate(usersValidation.signIn), usersController.signIn);

router.route("/").get(userAuth,usersController.getAllUsers);

module.exports = router;
