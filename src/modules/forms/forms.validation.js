const mongoose = require("mongoose");

function validateCreateFormPayload(req) {
  const payload = req.body;

  if (!Array.isArray(payload)) {
    return {
      valid: false,
      message: "Form payload must be an array of field objects",
      errorCode: "INVALID_FORM_PAYLOAD",
    };
  }

  for (let i = 0; i < payload.length; i += 1) {
    const field = payload[i];
    if (!field || typeof field !== "object" || Array.isArray(field)) {
      return {
        valid: false,
        message: `Form field at index ${i} must be an object`,
        errorCode: "INVALID_FORM_FIELD",
      };
    }
  }

  return { valid: true };
}

function validateFormIdParam(req) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      valid: false,
      message: "Invalid form id",
      errorCode: "INVALID_FORM_ID",
    };
  }

  return { valid: true };
}

module.exports = {
  validateCreateFormPayload,
  validateFormIdParam,
};
