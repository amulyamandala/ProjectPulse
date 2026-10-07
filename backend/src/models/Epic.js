import mongoose, { Schema } from "mongoose";

const EpicSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    requirementId: { type: Schema.Types.ObjectId, ref: "Requirement" },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: "OPEN" },
  },
  { timestamps: true },
);

export const Epic = mongoose.model("Epic", EpicSchema);
