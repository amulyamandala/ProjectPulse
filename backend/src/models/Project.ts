import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  key: string; // e.g. PROJ
  description?: string;
  leadId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true },
    key: { type: String, required: true, uppercase: true },
    description: { type: String },
    leadId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

ProjectSchema.index({ organizationId: 1, key: 1 }, { unique: true });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
