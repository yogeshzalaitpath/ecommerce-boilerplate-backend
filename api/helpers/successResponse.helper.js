const successResponse = (res, { data, message } = {}, statusCode = 200) => {
  const response = {
    success: 1,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

module.exports = { successResponse };
