import mongoose, { Schema } from "mongoose";

const RequirementTraceSchema = new Schema(
  {
    sourceType: { type: String, required: true },
    sourceId: { type: Schema.Types.ObjectId, required: true, index: true },
    targetType: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
  },
  { timestamps: true },
);

RequirementTraceSchema.index({ sourceId: 1, targetId: 1 }, { unique: true });

export const RequirementTrace = mongoose.model(
  "RequirementTrace",
  RequirementTraceSchema,
);
