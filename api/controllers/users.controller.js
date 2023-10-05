const { Users } = require("../models");

const asyncErrorHandler = require("../middlewares/asyncErrorHandler.middleware");

const {
  AlreadyExist,
  BadRequest,
  NotFound,
} = require("../helpers/customErrorHandler.helper");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { capitalizeFirstLetter } = require("../helpers/global.helper");
const { generateToken } = require("../helpers/jwt.helper");
const { ROLES } = require("../utils/constant");

exports.signUp = asyncErrorHandler(async (req, res, next) => {
  const { first_name, last_name, email, password, role } = req.body;

  const existingUser = await Users.findOne({
    where: { email: email.toLowerCase() },
  });
  if (existingUser) {
    return next(AlreadyExist("User already exists !"));
  }

  const hashedPassword = await hashPassword(password);

  await Users.create({
    first_name: capitalizeFirstLetter(first_name),
    last_name: capitalizeFirstLetter(last_name),
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
  });

  return successResponse(res, { message: "Sign up successful !" }, 201);
});

exports.signIn = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ where: { email: email.toLowerCase() } });
  if (user) {
    if (user.password) {
      const isValidPassword = await comparePassword(password, user.password);
      if (isValidPassword) {
        const jwtToken = generateToken(user);
        delete user.dataValues.password;
        if (user.role === ROLES.ADMIN) {
          delete user.dataValues.mobile;
          delete user.dataValues.address;
        }
        return successResponse(res, {
          message: "Sign in successful !",
          data: { user, token: jwtToken },
        });
      }
      return next(BadRequest("Incorrect password !"));
    } else {
      if (!user.password) return next(BadRequest("Incorrect password !"));
    }
  }
  return next(NotFound("User doesn't exist !"));
});
