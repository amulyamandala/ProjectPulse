import mongoose, { Schema, Document } from 'mongoose';
import { TaskStatus, Priority } from '@projectpulse/shared';

export interface ITask extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  sprintId?: mongoose.Types.ObjectId;
  key: string; // e.g. PROJ-1
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  storyPoints?: number;
  reporterId: mongoose.Types.ObjectId;
  assigneeId?: mongoose.Types.ObjectId;
  epicId?: mongoose.Types.ObjectId;
  userStoryId?: mongoose.Types.ObjectId;
  dueDate?: Date;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint', index: true },
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.BACKLOG },
    priority: { type: String, enum: Object.values(Priority), default: Priority.MEDIUM },
    storyPoints: { type: Number },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
    epicId: { type: Schema.Types.ObjectId, ref: 'Epic' },
    userStoryId: { type: Schema.Types.ObjectId, ref: 'UserStory' },
    dueDate: { type: Date },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
