import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    aiGeneratedCode: {
      type: String,
      required: true,
    },
    pythonResponse: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true },
);

const Analysis =
  mongoose.models.Analysis || mongoose.model("Analysis", AnalysisSchema);

export default Analysis;
