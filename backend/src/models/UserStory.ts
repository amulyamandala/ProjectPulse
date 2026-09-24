import mongoose, { Schema, Document } from 'mongoose';

export interface IUserStory extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  epicId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserStorySchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    epicId: { type: Schema.Types.ObjectId, ref: 'Epic' },
    title: { type: String, required: true },
    description: { type: String },
    acceptanceCriteria: { type: String },
    storyPoints: { type: Number },
  },
  { timestamps: true }
);

export const UserStory = mongoose.model<IUserStory>('UserStory', UserStorySchema);
