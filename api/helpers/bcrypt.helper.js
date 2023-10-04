const bcrypt = require("bcrypt");

const hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async function (password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

module.exports = { hashPassword, comparePassword };
