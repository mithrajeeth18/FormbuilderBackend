const express = require("express");
const { createForm, getFormById } = require("./forms.controller");
const validate = require("../../middlewares/validate");
const requireAuth = require("../../middlewares/requireAuth");
const {
  validateCreateFormPayload,
  validateFormIdParam,
} = require("./forms.validation");

const router = express.Router();

router.post("/", requireAuth, validate(validateCreateFormPayload), createForm);
router.get("/:id", validate(validateFormIdParam), getFormById);

module.exports = router;
