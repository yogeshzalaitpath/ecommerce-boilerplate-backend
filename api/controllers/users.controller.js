const { Users } = require("../models");

const asyncErrorHandler = require("../middlewares/asyncErrorHandler.middleware");

const {
  AlreadyExist,
  BadRequest,
  NotFound,
} = require("../helpers/customErrorHandler.helper");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { capitalizeFirstLetter } = require("../helpers/global.helper");
const { where, Op } = require("sequelize");
const { generateToken } = require("../helpers/jwt.helper");
const { ROLES } = require("../utils/constant");
const { escapeRegex } = require("../helpers/global.helper");

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

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const { search, limit, page } = req.query;
  console.log("limit", limit);
  console.log("page", page);

  const parsedLimit = parseInt(limit) || 10;
  const parsedPage = parseInt(page) || 1;
  if (isNaN(parsedLimit) || parsedLimit <= 0) {
    return next(BadRequest("Invalid limit parameter !"));
  }
  const offset = (parsedPage - 1) * parsedLimit;
  try {
    const searchTerms = search?.split(" ");
    const { rows: users, count: totalUsers } = await Users.findAndCountAll({
      limit: parsedLimit,
      offset: offset,
      attributes: {
        exclude: ["password"],
      },
      where: {
        [Op.and]: [
          { role: "user" },
          {
            [Op.or]: [
              {
                [Op.or]: [
                  { first_name: { [Op.like]: `%${searchTerms[0]}%` } },
                  { last_name: { [Op.like]: `%${searchTerms[1]}%` } },
                ],
              },
              {
                [Op.or]: [
                  { first_name: { [Op.like]: `%${searchTerms[1]}%` } },
                  { last_name: { [Op.like]: `%${searchTerms[0]}%` } },
                ],
              },
              { email: { [Op.like]: `%${search}%` } },
              { mobile: { [Op.like]: `%${search}%` } },
            ],
          },
        ],
      },
    });

    return successResponse(res, {
      data: { users, total_users: totalUsers, total_pages: parsedPage },
    });
  } catch (error) {
    return next(error);
  }
});

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a route parameter
    const user = await Users.findByPk(userId);

    if (!user) {
      return next(NotFound("User not found"));
    }

    await user.destroy();
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return next(error);
  }
});
