import mongoose, { Schema, Document } from 'mongoose';

export interface IEpic extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  requirementId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const EpicSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    requirementId: { type: Schema.Types.ObjectId, ref: 'Requirement' },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'OPEN' },
  },
  { timestamps: true }
);

export const Epic = mongoose.model<IEpic>('Epic', EpicSchema);
