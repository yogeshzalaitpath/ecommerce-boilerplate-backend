const { body } = require("express-validator");

const signUp = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First Name can't be empty !"),
  body("last_name").trim().notEmpty().withMessage("Last Name can't be empty !"),
  body("email").trim().notEmpty().withMessage("Email can't be empty !"),
  body("password").trim().notEmpty().withMessage("Password can't be empty !"),
  body("role").trim().notEmpty().withMessage("Role can't be empty !"),
];

const signIn = [
  body("email").trim().notEmpty().withMessage("Email can't be empty !"),
  body("password").trim().notEmpty().withMessage("Password can't be empty !"),
];

module.exports = {
  signUp,
  signIn,
};
