const express = require("express");
const requireAuth = require("../../middlewares/requireAuth");
const validate = require("../../middlewares/validate");
const {
  submitFormResponse,
  getFormResponses,
  getFormResponseDetail,
} = require("./responses.controller");
const {
  validateSubmitResponsePayload,
  validateResponseFormIdParam,
  validateResponseIdParam,
  validateGetResponsesQuery,
} = require("./responses.validation");

const router = express.Router();

router.post(
  "/forms/:id/responses",
  requireAuth,
  validate(validateResponseFormIdParam),
  validate(validateSubmitResponsePayload),
  submitFormResponse
);

router.get(
  "/forms/:id/responses",
  requireAuth,
  validate(validateResponseFormIdParam),
  validate(validateGetResponsesQuery),
  getFormResponses
);

router.get(
  "/forms/:id/responses/:responseId",
  requireAuth,
  validate(validateResponseFormIdParam),
  validate(validateResponseIdParam),
  getFormResponseDetail
);

module.exports = router;
