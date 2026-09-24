import mongoose, { Schema, Document } from 'mongoose';
import { IssueSeverity, TaskStatus } from '@projectpulse/shared';

export interface IIssue extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId; // Issue can be linked to a task
  key: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: TaskStatus; // Typically issues follow similar status flows, or separate ones
  reporterId: mongoose.Types.ObjectId;
  assigneeId?: mongoose.Types.ObjectId;
  reproductionSteps?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  environment?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, enum: Object.values(IssueSeverity), default: IssueSeverity.MEDIUM },
    status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.TODO },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
    reproductionSteps: { type: String },
    expectedBehavior: { type: String },
    actualBehavior: { type: String },
    environment: { type: String },
    resolution: { type: String },
  },
  { timestamps: true }
);

export const Issue = mongoose.model<IIssue>('Issue', IssueSchema);
