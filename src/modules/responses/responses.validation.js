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
  if (isPrimitive(value)) {
    return value;
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

module.exports = {
  sanitizeResponseAnswers,
};
