import mongoose, { Schema, Document } from 'mongoose';

export interface IDefinitionOfDone extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  rules: { description: string; isRequired: boolean }[];
  createdAt: Date;
  updatedAt: Date;
}

const DefinitionOfDoneSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    rules: [
      {
        description: { type: String, required: true },
        isRequired: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

export const DefinitionOfDone = mongoose.model<IDefinitionOfDone>('DefinitionOfDone', DefinitionOfDoneSchema);
