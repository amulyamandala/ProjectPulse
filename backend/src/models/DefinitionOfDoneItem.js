import mongoose, { Schema } from "mongoose";

const DefinitionOfDoneItemSchema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    dodId: {
      type: Schema.Types.ObjectId,
      ref: "DefinitionOfDone",
      required: true,
    },
    ruleId: { type: Schema.Types.ObjectId, required: true },
    isCompleted: { type: Boolean, default: false },
    completedBy: { type: Schema.Types.ObjectId, ref: "User" },
    completedAt: { type: Date },
    isOverridden: { type: Boolean, default: false },
    overrideReason: { type: String },
    overriddenBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const DefinitionOfDoneItem = mongoose.model(
  "DefinitionOfDoneItem",
  DefinitionOfDoneItemSchema,
);
