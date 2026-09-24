import mongoose, { Schema, Document } from 'mongoose';

export interface IRequirement extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  key: string;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const RequirementSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    key: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'OPEN' },
  },
  { timestamps: true }
);

export const Requirement = mongoose.model<IRequirement>('Requirement', RequirementSchema);
