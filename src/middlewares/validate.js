const ApiError = require("../utils/apiError");

function validate(schema) {
  return (req, res, next) => {
    const result = schema(req);
    if (result.valid) {
      return next();
    }

    return next(new ApiError(400, result.message, result.errorCode || "VALIDATION_ERROR"));
  };
}

module.exports = validate;
