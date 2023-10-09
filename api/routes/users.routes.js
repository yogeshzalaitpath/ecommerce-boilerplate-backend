var express = require("express");
var router = express.Router();

const validate = require("../middlewares/validator-error.middleware");
const usersValidation = require("../validations/users.validation");

const usersController = require("../controllers/users.controller");
const userAuth = require("../middlewares/userAuth.middleware");
const { profileUpload } = require("../middlewares/imageupload.Middleware");

router
  .route("/sign-up")
  .post(validate(usersValidation.signUp), usersController.signUp);

router
  .route("/sign-in")
  .post(validate(usersValidation.signIn), usersController.signIn);

router.route("/:userId?").get(userAuth,usersController.getAllUsers).delete(userAuth,usersController.deleteUser);

router.route("/profile").put(userAuth, profileUpload.single("profile_image"),usersController.editProfile);

module.exports = router;
