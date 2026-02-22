const express = require("express");
const {
  createForm,
  getFormById,
  getMyForms,
  updateMyForm,
  publishMyForm,
} = require("./forms.controller");
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
router.put("/:id", requireAuth, validate(validateFormIdParam), validate(validateCreateFormPayload), updateMyForm);
router.post("/:id/publish", requireAuth, validate(validateFormIdParam), publishMyForm);
router.get("/:id", validate(validateFormIdParam), getFormById);

module.exports = router;
