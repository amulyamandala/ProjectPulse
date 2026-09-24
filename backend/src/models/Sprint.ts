import mongoose, { Schema, Document } from 'mongoose';
import { SprintStatus } from '@projectpulse/shared';

export interface ISprint extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  goal?: string;
  startDate?: Date;
  endDate?: Date;
  status: SprintStatus;
  plannedStoryPoints: number;
  completedStoryPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const SprintSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    name: { type: String, required: true },
    goal: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: Object.values(SprintStatus), default: SprintStatus.PLANNED },
    plannedStoryPoints: { type: Number, default: 0 },
    completedStoryPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Sprint = mongoose.model<ISprint>('Sprint', SprintSchema);
