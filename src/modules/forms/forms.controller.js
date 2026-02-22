const formsService = require("./forms.service");
const { logInfo, logError } = require("../../utils/logger");
const ApiError = require("../../utils/apiError");

async function createForm(req, res, next) {
  try {
    const saved = await formsService.createForm({
      ownerId: req.user.id,
      config: req.body,
      status: "published",
    });
    logInfo(`Form created: ${saved._id}`);
    return res.status(200).json({
      success: true,
      message: "Form created",
      data: { id: saved._id },
      id: saved._id,
    });
  } catch (err) {
    logError("Failed to create form", err);
    return next(new ApiError(500, "Failed to save form", "FORM_CREATE_FAILED"));
  }
}

async function getFormById(req, res, next) {
  try {
    const form = await formsService.findPublishedFormById(req.params.id);
    if (!form) {
      return next(new ApiError(404, "Form not found", "FORM_NOT_FOUND"));
    }
    return res.status(200).json({
      success: true,
      message: "Form fetched",
      data: { form: form.config },
      form: form.config,
    });
  } catch (err) {
    logError("Failed to fetch form by id", err);
    return next(new ApiError(500, "Failed to fetch form", "FORM_FETCH_FAILED"));
  }
}

module.exports = {
  createForm,
  getFormById,
};
