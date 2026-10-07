import mongoose, { Schema } from "mongoose";

const DefinitionOfDoneSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    rules: [
      {
        description: { type: String, required: true },
        isRequired: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true },
);

export const DefinitionOfDone = mongoose.model(
  "DefinitionOfDone",
  DefinitionOfDoneSchema,
);
