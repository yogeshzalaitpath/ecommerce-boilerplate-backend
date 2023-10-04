const customErrorHandler = (statusCode, message) => {
  const error = new Error();
  error.status = statusCode;
  error.message = message;
  return error;
};

customErrorHandler.BadRequest = (message) => {
  return customErrorHandler(400, message);
};

customErrorHandler.UnAuthorized = (
  message = "Unauthorized to access the data !"
) => {
  return customErrorHandler(401, message);
};

customErrorHandler.Forbidden = (
  message = "This resource requires admin privileges for access. !"
) => {
  return customErrorHandler(403, message);
};

customErrorHandler.NotFound = (message) => {
  return customErrorHandler(404, message);
};

customErrorHandler.AlreadyExist = (message) => {
  return customErrorHandler(409, message);
};

module.exports = customErrorHandler;
