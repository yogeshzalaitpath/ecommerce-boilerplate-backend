const { UnAuthorized } = require("../helpers/customErrorHandler.helper");
const { Users } = require("../models");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler.middleware");
const { verifyToken } = require("../helpers/jwt.helper");

const userAuth = asyncErrorHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if(!authHeader){
    return next(UnAuthorized());
  }
  const token = authHeader.replace("Bearer ", "");

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return next(UnAuthorized());
  }

  const user = await Users.findOne({where:{ id: decodedToken.id }});
  if (!user) {
    return next(UnAuthorized());
  }
  req.user = user;
  return next();
});

module.exports = userAuth;
