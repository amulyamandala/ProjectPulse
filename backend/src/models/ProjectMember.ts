import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '@projectpulse/shared';

export interface IProjectMember extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: Role;
}

const ProjectMemberSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: Object.values(Role), default: Role.DEVELOPER },
  },
  { timestamps: true }
);

ProjectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export const ProjectMember = mongoose.model<IProjectMember>('ProjectMember', ProjectMemberSchema);
