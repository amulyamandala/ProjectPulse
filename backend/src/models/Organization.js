import mongoose, { Schema } from "mongoose";

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Organization = mongoose.model("Organization", OrganizationSchema);
