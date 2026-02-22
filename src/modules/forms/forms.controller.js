const formsService = require("./forms.service");
const responsesService = require("../responses/responses.service");
const { logInfo, logError } = require("../../utils/logger");
const ApiError = require("../../utils/apiError");

async function createForm(req, res, next) {
  try {
    const saved = await formsService.createForm({
      ownerId: req.user.id,
      config: req.body,
      status: "draft",
    });
    logInfo(`Form created: ${saved._id}`);
    return res.status(200).json({
      success: true,
      message: "Form created",
      data: { id: saved._id, status: saved.status },
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

async function getMyForms(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "desc";

    const { forms, total } = await formsService.findFormsByOwner({
      ownerId: req.user.id,
      page,
      limit,
      sortBy,
      order,
    });

    const formIds = forms.map((form) => form._id);
    const responseCounts = await responsesService.countResponsesByFormIds(formIds);

    const items = forms.map((form) => ({
      id: String(form._id),
      status: form.status || "published",
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      fieldCount: Array.isArray(form.config) ? form.config.length : 0,
      responseCount: responseCounts[String(form._id)] || 0,
    }));

    return res.status(200).json({
      success: true,
      message: "My forms fetched",
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (err) {
    logError("Failed to fetch owner forms", err);
    return next(new ApiError(500, "Failed to fetch owner forms", "OWNER_FORMS_FETCH_FAILED"));
  }
}

async function getMyFormById(req, res, next) {
  try {
    const form = await formsService.findOwnedFormDetailById({
      formId: req.params.id,
      ownerId: req.user.id,
    });

    if (!form) {
      return next(new ApiError(404, "Form not found", "FORM_NOT_FOUND"));
    }

    return res.status(200).json({
      success: true,
      message: "My form fetched",
      data: {
        form: {
          id: String(form._id),
          status: form.status || "published",
          config: form.config || [],
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
        },
      },
    });
  } catch (err) {
    logError("Failed to fetch owner form by id", err);
    return next(new ApiError(500, "Failed to fetch owner form", "OWNER_FORM_FETCH_FAILED"));
  }
}

async function updateMyForm(req, res, next) {
  try {
    const updated = await formsService.updateOwnedFormById({
      formId: req.params.id,
      ownerId: req.user.id,
      config: req.body,
    });

    if (!updated) {
      return next(new ApiError(404, "Form not found", "FORM_NOT_FOUND"));
    }

    logInfo(`Form updated by owner: ${updated._id}`);

    return res.status(200).json({
      success: true,
      message: "Form updated as draft",
      data: {
        id: String(updated._id),
        status: updated.status,
      },
    });
  } catch (err) {
    logError("Failed to update form", err);
    return next(new ApiError(500, "Failed to update form", "FORM_UPDATE_FAILED"));
  }
}

async function publishMyForm(req, res, next) {
  try {
    const published = await formsService.publishOwnedFormById({
      formId: req.params.id,
      ownerId: req.user.id,
    });

    if (!published) {
      return next(new ApiError(404, "Form not found", "FORM_NOT_FOUND"));
    }

    logInfo(`Form published by owner: ${published._id}`);

    return res.status(200).json({
      success: true,
      message: "Form published",
      data: {
        id: String(published._id),
        status: published.status,
      },
    });
  } catch (err) {
    logError("Failed to publish form", err);
    return next(new ApiError(500, "Failed to publish form", "FORM_PUBLISH_FAILED"));
  }
}

module.exports = {
  createForm,
  getFormById,
  getMyForms,
  getMyFormById,
  updateMyForm,
  publishMyForm,
};
