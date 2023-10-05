const { validationResult } = require("express-validator");
const { BadRequest } = require("../helpers/customErrorHandler.helper");

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return next(
        BadRequest(
          Object.entries(errors.mapped()).reduce((error, [key, value]) => {
            error[key] = value.msg;
            return error;
          }, {})
        )
      );
    }
  };
};

module.exports = validate;
