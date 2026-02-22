const crypto = require("crypto");
const ApiError = require("../../utils/apiError");
const { logError, logInfo } = require("../../utils/logger");
const formsService = require("../forms/forms.service");
const responsesService = require("./responses.service");
const { sanitizeResponseAnswers } = require("./responses.validation");

function hashIp(ip) {
  if (!ip) return "";
  return crypto.createHash("sha256").update(String(ip)).digest("hex");
}

async function submitFormResponse(req, res, next) {
  try {
    const form = await formsService.findPublishedFormById(req.params.id);
    if (!form) {
      return next(new ApiError(404, "Form not found", "FORM_NOT_FOUND"));
    }

    const sanitized = sanitizeResponseAnswers(req.body.answers);
    if (!sanitized.valid) {
      return next(new ApiError(400, sanitized.message, sanitized.errorCode || "INVALID_ANSWERS_PAYLOAD"));
    }

    const saved = await responsesService.createResponse({
      formId: form._id,
      ownerId: form.ownerId,
      submittedBy: {
        userId: req.user.id,
        email: req.user.email,
        name: req.user.name,
        authProvider: req.user.authProvider || "google",
      },
      answers: sanitized.value,
      metadata: {
        userAgent: req.get("user-agent") || "",
        ipHash: hashIp(req.ip),
      },
    });

    logInfo(`Response submitted: ${saved._id} for form ${form._id}`);

    return res.status(201).json({
      success: true,
      message: "Response submitted",
      data: {
        responseId: String(saved._id),
      },
    });
  } catch (err) {
    logError("Failed to submit response", err);
    return next(new ApiError(500, "Failed to submit response", "RESPONSE_SUBMIT_FAILED"));
  }
}

async function getFormResponses(req, res, next) {
  try {
    const form = await formsService.findOwnedFormById({
      formId: req.params.id,
      ownerId: req.user.id,
    });

    if (!form) {
      return next(new ApiError(404, "Form not found", "FORM_NOT_FOUND"));
    }

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const { items, total } = await responsesService.findResponsesByForm({
      formId: form._id,
      ownerId: form.ownerId,
      page,
      limit,
      search,
    });

    const summaries = items.map((item) => ({
      id: String(item._id),
      submittedBy: item.submittedBy,
      submittedAt: item.createdAt,
      answerCount: item.answers && typeof item.answers === "object" ? Object.keys(item.answers).length : 0,
    }));

    return res.status(200).json({
      success: true,
      message: "Form responses fetched",
      data: {
        items: summaries,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (err) {
    logError("Failed to fetch form responses", err);
    return next(new ApiError(500, "Failed to fetch form responses", "FORM_RESPONSES_FETCH_FAILED"));
  }
}

async function getFormResponseDetail(req, res, next) {
  try {
    const form = await formsService.findOwnedFormById({
      formId: req.params.id,
      ownerId: req.user.id,
    });

    if (!form) {
      return next(new ApiError(404, "Form not found", "FORM_NOT_FOUND"));
    }

    const response = await responsesService.findResponseDetailById({
      responseId: req.params.responseId,
      formId: form._id,
      ownerId: form.ownerId,
    });

    if (!response) {
      return next(new ApiError(404, "Response not found", "RESPONSE_NOT_FOUND"));
    }

    return res.status(200).json({
      success: true,
      message: "Response detail fetched",
      data: {
        response: {
          id: String(response._id),
          formId: String(response.formId),
          submittedBy: response.submittedBy,
          submittedAt: response.createdAt,
          answers: response.answers,
          metadata: response.metadata,
        },
      },
    });
  } catch (err) {
    logError("Failed to fetch response detail", err);
    return next(new ApiError(500, "Failed to fetch response detail", "RESPONSE_DETAIL_FETCH_FAILED"));
  }
}

module.exports = {
  submitFormResponse,
  getFormResponses,
  getFormResponseDetail,
};
