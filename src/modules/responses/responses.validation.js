const mongoose = require("mongoose");

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPrimitive(value) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  );
}

function sanitizeSingleAnswer(value) {
  if (value === undefined) {
    return { valid: true, value: null };
  }

  if (isPrimitive(value)) {
    return { valid: true, value };
  }

  if (Array.isArray(value)) {
    const cleanArray = [];
    for (let i = 0; i < value.length; i += 1) {
      if (!isPrimitive(value[i])) {
        return { valid: false, message: "Array answers can only contain primitive values" };
      }
      cleanArray.push(value[i]);
    }
    return { valid: true, value: cleanArray };
  }

  // For file-like answers, store only file name.
  if (isPlainObject(value) && typeof value.name === "string" && value.name.trim() !== "") {
    return { valid: true, value: value.name.trim() };
  }

  return {
    valid: false,
    message: "Answer values must be primitive, primitive arrays, or file-name objects",
  };
}

function sanitizeResponseAnswers(rawAnswers) {
  if (!isPlainObject(rawAnswers)) {
    return {
      valid: false,
      message: "Answers payload must be an object",
      errorCode: "INVALID_ANSWERS_PAYLOAD",
    };
  }

  const sanitized = {};
  const keys = Object.keys(rawAnswers);

  for (let i = 0; i < keys.length; i += 1) {
    const fieldId = keys[i];
    const checked = sanitizeSingleAnswer(rawAnswers[fieldId]);
    if (!checked.valid) {
      return {
        valid: false,
        message: `Invalid answer for field '${fieldId}': ${checked.message}`,
        errorCode: "INVALID_ANSWER_VALUE",
      };
    }
    sanitized[fieldId] = checked.value;
  }

  return { valid: true, value: sanitized };
}

function validateSubmitResponsePayload(req) {
  const payload = req.body;

  if (!isPlainObject(payload)) {
    return {
      valid: false,
      message: "Request body must be an object",
      errorCode: "INVALID_RESPONSE_BODY",
    };
  }

  if (!isPlainObject(payload.answers)) {
    return {
      valid: false,
      message: "Field 'answers' must be an object",
      errorCode: "INVALID_ANSWERS_PAYLOAD",
    };
  }

  return { valid: true };
}

function validateResponseFormIdParam(req) {
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

function validateResponseIdParam(req) {
  const { responseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(responseId)) {
    return {
      valid: false,
      message: "Invalid response id",
      errorCode: "INVALID_RESPONSE_ID",
    };
  }

  return { valid: true };
}

function validateGetResponsesQuery(req) {
  const { page, limit, search } = req.query;

  if (page !== undefined) {
    const parsed = Number(page);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return {
        valid: false,
        message: "Query param 'page' must be a positive integer",
        errorCode: "INVALID_PAGE",
      };
    }
  }

  if (limit !== undefined) {
    const parsed = Number(limit);
    if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 100) {
      return {
        valid: false,
        message: "Query param 'limit' must be an integer between 1 and 100",
        errorCode: "INVALID_LIMIT",
      };
    }
  }

  if (search !== undefined && typeof search !== "string") {
    return {
      valid: false,
      message: "Query param 'search' must be a string",
      errorCode: "INVALID_SEARCH",
    };
  }

  return { valid: true };
}

module.exports = {
  sanitizeResponseAnswers,
  validateSubmitResponsePayload,
  validateResponseFormIdParam,
  validateResponseIdParam,
  validateGetResponsesQuery,
};
