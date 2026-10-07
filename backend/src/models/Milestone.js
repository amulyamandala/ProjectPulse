import mongoose, { Schema } from "mongoose";

const MilestoneSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    targetDate: { type: Date, required: true },
    status: { type: String, default: "ON_TRACK" },
  },
  { timestamps: true },
);

export const Milestone = mongoose.model("Milestone", MilestoneSchema);
