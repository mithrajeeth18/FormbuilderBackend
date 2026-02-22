const express = require("express");
const requireAuth = require("../../middlewares/requireAuth");
const validate = require("../../middlewares/validate");
const { submitFormResponse } = require("./responses.controller");
const {
  validateSubmitResponsePayload,
  validateResponseFormIdParam,
} = require("./responses.validation");

const router = express.Router();

router.post(
  "/forms/:id/responses",
  requireAuth,
  validate(validateResponseFormIdParam),
  validate(validateSubmitResponsePayload),
  submitFormResponse
);

module.exports = router;
