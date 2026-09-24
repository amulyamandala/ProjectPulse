import mongoose, { Schema, Document } from 'mongoose';

export interface ITestCase extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  requirementId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  steps: string;
  expectedResult: string;
  status: string; // 'PASSED', 'FAILED', 'UNTESTED'
}

const TestCaseSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    requirementId: { type: Schema.Types.ObjectId, ref: 'Requirement' },
    title: { type: String, required: true },
    description: { type: String },
    steps: { type: String },
    expectedResult: { type: String },
    status: { type: String, default: 'UNTESTED' },
  },
  { timestamps: true }
);

export const TestCase = mongoose.model<ITestCase>('TestCase', TestCaseSchema);
