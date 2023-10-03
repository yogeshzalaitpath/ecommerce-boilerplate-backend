const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (user) => {
  try {
    const token = jwt.sign({ id: user._id }, secretKey);
    return token;
  } catch (error) {
    return error;
  }
};

const generateVerificationToken = (user) => {
  try {
    const token = jwt.sign(user, secretKey, { expiresIn: "24h" });
    return token;
  } catch (error) {
    return error;
  }
};

const generateResetPassToken = (email) => {
  try {
    const token = jwt.sign({ email }, secretKey, { expiresIn: "15m" });
    return token;
  } catch (error) {
    return null;
  }
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateVerificationToken,
  generateResetPassToken,
};