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
const {
  extractPublicIdFromUrl,
  deleteImageFromCloudinary,
} = require("../helpers/cloudinary.helper");

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
  const { search, limit, page, filter } = req.query;
  console.log("filter", filter);
  const gender = filter;
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
          gender ? { gender: gender } : {},
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

    const total_pages = Math.ceil(totalUsers / parsedLimit);

    return successResponse(res, {
      data: { users, total_users: totalUsers, total_pages: total_pages },
    });
  } catch (error) {
    return next(error);
  }
});

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  try {
    const { userId } = req.params; // Extract userId directly from req.params
    console.log('userId', userId);

    const user = await Users.findByPk(userId);

    if (!user) {
      return next(NotFound("User doesn't exist !"));
    }

    await Users.destroy({
      where: {
        id: userId
      }
    });
    return successResponse(res, {
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
});


exports.editProfile = asyncErrorHandler(async (req, res, next) => {
  const { first_name, last_name, gender, mobile, address } =
    req.body;
  let profile_image = req.user.profile_image;
  if (req.file) {
    if (profile_image) {
      const publicId = extractPublicIdFromUrl(profile_image);
      await deleteImageFromCloudinary(`profiles/${publicId}`);
    }
    profile_image = req.file.path;
  }
  console.log('profile_image', profile_image)
  const userId = req.user.id;
  // console.log("userId", userId);

  let user = await Users.findByPk(userId);

  if (!user) {
    return next(NotFound("User doesn't exist !"));
  }

  // Update user profile fields
  user.first_name = first_name;
  user.last_name = last_name;
  user.gender = gender;
  user.mobile = mobile;
  user.address = address;
  user.profile_image = profile_image;
  // Save the updated user profile
  await user.save();

  return successResponse(
    res,
    { message: "Profile updated successfully!" },
    201
  );
});
