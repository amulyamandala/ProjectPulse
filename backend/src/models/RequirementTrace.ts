import mongoose, { Schema, Document } from 'mongoose';

export interface IRequirementTrace extends Document {
  sourceType: string; // e.g. Requirement, Epic, UserStory
  sourceId: mongoose.Types.ObjectId;
  targetType: string; // e.g. Epic, UserStory, Task, TestCase, Issue, Release
  targetId: mongoose.Types.ObjectId;
}

const RequirementTraceSchema = new Schema(
  {
    sourceType: { type: String, required: true },
    sourceId: { type: Schema.Types.ObjectId, required: true, index: true },
    targetType: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
  },
  { timestamps: true }
);

RequirementTraceSchema.index({ sourceId: 1, targetId: 1 }, { unique: true });

export const RequirementTrace = mongoose.model<IRequirementTrace>('RequirementTrace', RequirementTraceSchema);
