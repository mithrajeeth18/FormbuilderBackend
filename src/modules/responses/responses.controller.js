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

module.exports = {
  submitFormResponse,
};
