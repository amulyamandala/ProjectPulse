import mongoose, { Schema } from "mongoose";

const RequirementSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    key: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: "OPEN" },
  },
  { timestamps: true },
);

export const Requirement = mongoose.model("Requirement", RequirementSchema);
