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

function validateGetMyFormsQuery(req) {
  const allowedSortBy = ["createdAt", "updatedAt", "status"];
  const allowedOrder = ["asc", "desc"];

  const page = req.query.page;
  const limit = req.query.limit;
  const sortBy = req.query.sortBy;
  const order = req.query.order;

  if (page !== undefined) {
    const parsedPage = Number(page);
    if (!Number.isInteger(parsedPage) || parsedPage <= 0) {
      return {
        valid: false,
        message: "Query param 'page' must be a positive integer",
        errorCode: "INVALID_PAGE",
      };
    }
  }

  if (limit !== undefined) {
    const parsedLimit = Number(limit);
    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
      return {
        valid: false,
        message: "Query param 'limit' must be an integer between 1 and 100",
        errorCode: "INVALID_LIMIT",
      };
    }
  }

  if (sortBy !== undefined && !allowedSortBy.includes(sortBy)) {
    return {
      valid: false,
      message: "Query param 'sortBy' must be one of: createdAt, updatedAt, status",
      errorCode: "INVALID_SORT_BY",
    };
  }

  if (order !== undefined && !allowedOrder.includes(order)) {
    return {
      valid: false,
      message: "Query param 'order' must be 'asc' or 'desc'",
      errorCode: "INVALID_ORDER",
    };
  }

  return { valid: true };
}

module.exports = {
  validateCreateFormPayload,
  validateFormIdParam,
  validateGetMyFormsQuery,
};
