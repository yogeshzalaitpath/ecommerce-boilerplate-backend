const successResponse = (res, { data, message } = {}, statusCode = 200) => {
  const response = {
    status: "SUCCESS",
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

module.exports = { successResponse };
