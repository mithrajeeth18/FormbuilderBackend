const mongoose = require("mongoose");

const submittedBySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ["google"],
      default: "google",
    },
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    submittedBy: {
      type: submittedBySchema,
      required: true,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    metadata: {
      userAgent: {
        type: String,
        default: "",
      },
      ipHash: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

responseSchema.index({ formId: 1, createdAt: -1 });
responseSchema.index({ ownerId: 1, createdAt: -1 });

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
