import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true },
);

TeamSchema.index({ organizationId: 1, name: 1 }, { unique: true });

export const Team = mongoose.model("Team", TeamSchema);
