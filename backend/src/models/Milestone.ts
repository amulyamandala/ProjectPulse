import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestone extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  targetDate: Date;
  status: string; // 'ON_TRACK', 'AT_RISK', 'OVERDUE', 'COMPLETED'
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    targetDate: { type: Date, required: true },
    status: { type: String, default: 'ON_TRACK' },
  },
  { timestamps: true }
);

export const Milestone = mongoose.model<IMilestone>('Milestone', MilestoneSchema);
