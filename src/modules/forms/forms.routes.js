const express = require("express");
const { createForm, getFormById, getMyForms } = require("./forms.controller");
const validate = require("../../middlewares/validate");
const requireAuth = require("../../middlewares/requireAuth");
const {
  validateCreateFormPayload,
  validateFormIdParam,
  validateGetMyFormsQuery,
} = require("./forms.validation");

const router = express.Router();

router.get("/mine", requireAuth, validate(validateGetMyFormsQuery), getMyForms);
router.post("/", requireAuth, validate(validateCreateFormPayload), createForm);
router.get("/:id", validate(validateFormIdParam), getFormById);

module.exports = router;
