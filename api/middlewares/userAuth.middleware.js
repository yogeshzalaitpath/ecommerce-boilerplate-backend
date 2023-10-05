const { UnAuthorized } = require("../helpers/customErrorHandler.helper");
const { Users } = require("../models");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler.middleware");
const { verifyToken } = require("../helpers/jwt.helper");

const userAuth = asyncErrorHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader.replace("Bearer ", "");

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return next(UnAuthorized());
  }

  const user = await Users.findOne({ _id: decodedToken.id }, { password: 0 });
  if (!user) {
    return next(UnAuthorized());
  }
  req.user = user;
  return next();
});

module.exports = userAuth;