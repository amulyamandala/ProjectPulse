import mongoose, { Schema, Document } from 'mongoose';
import { DependencyType } from '@projectpulse/shared';

export interface ITaskDependency extends Document {
  sourceTaskId: mongoose.Types.ObjectId;
  targetTaskId: mongoose.Types.ObjectId;
  type: DependencyType;
}

const TaskDependencySchema = new Schema(
  {
    sourceTaskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    targetTaskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    type: { type: String, enum: Object.values(DependencyType), required: true },
  },
  { timestamps: true }
);

TaskDependencySchema.index({ sourceTaskId: 1, targetTaskId: 1 }, { unique: true });

export const TaskDependency = mongoose.model<ITaskDependency>('TaskDependency', TaskDependencySchema);
