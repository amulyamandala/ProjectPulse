import mongoose, { Schema, Document } from 'mongoose';

export interface IDefinitionOfDoneItem extends Document {
  taskId: mongoose.Types.ObjectId;
  dodId: mongoose.Types.ObjectId;
  ruleId: mongoose.Types.ObjectId; // referencing the sub-document ID from DefinitionOfDone.rules
  isCompleted: boolean;
  completedBy?: mongoose.Types.ObjectId;
  completedAt?: Date;
  isOverridden: boolean;
  overrideReason?: string;
  overriddenBy?: mongoose.Types.ObjectId;
}

const DefinitionOfDoneItemSchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    dodId: { type: Schema.Types.ObjectId, ref: 'DefinitionOfDone', required: true },
    ruleId: { type: Schema.Types.ObjectId, required: true },
    isCompleted: { type: Boolean, default: false },
    completedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    completedAt: { type: Date },
    isOverridden: { type: Boolean, default: false },
    overrideReason: { type: String },
    overriddenBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const DefinitionOfDoneItem = mongoose.model<IDefinitionOfDoneItem>('DefinitionOfDoneItem', DefinitionOfDoneItemSchema);
