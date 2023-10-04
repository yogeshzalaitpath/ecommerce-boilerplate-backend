const { Users } = require("../models"); // Import your Mongoose User model
// const { AlreadyExist, asyncErrorHandler, hashPassword } = require('path/to/your/utils'); // Import necessary utilities
const { AlreadyExist } = require("../helpers/customErrorHandler.helper");
const { hashPassword } = require("../helpers/bcrypt.helper");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler.middleware");
const { where } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

const signUp = asyncErrorHandler(async (req, res, next) => {
  const { first_name, last_name, email, password, role } = req.body;

  // Check if the user already exists
  const existingUser = await Users.findOne({ where: { email: email } });

  if (existingUser) {
    return next(AlreadyExist("User already exists!"));
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create a new user object
  const user = new Users({
    first_name,
    last_name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
  });

  // Save the user to the database
  await user.save();

  return successResponse(
    res,
    { message: "User registered successfully!" },
    201
  );
});

// const deleteRow = asyncErrorHandler(async(req,res,next)=>{
//   const count = await  Users.destroy({ where: { id: 2 } });
//   console.log('count', count)
// })

// Utility function for sending success response
function successResponse(res, data, status = 200) {
  return res.status(status).json(data);
}

const signIn = asyncErrorHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = { email, password };
    console.log(data);

    if (!email || !password) {
      return res.status(401).send("all fields are required");
    }

    const user = await Users.findOne({ where: { email: email } });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        console.log("login successful");

        jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
          if (err) {
            return next(err);
          }
          res.json({ token });
        });
      } else {
        return res.status(401).json({ Password: "incorrect password" });
      }
    } else {
      return res.status(401).json({ Email: "user not found" });
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = { signUp, signIn };
