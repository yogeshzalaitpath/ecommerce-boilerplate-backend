const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    status: "ERROR",
    message: errorMessage,
  });
};

module.exports = errorHandler;
