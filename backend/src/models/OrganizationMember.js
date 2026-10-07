import mongoose, { Schema } from "mongoose";
import { Role } from "@projectpulse/shared";

const OrganizationMemberSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: Object.values(Role), default: Role.DEVELOPER },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

OrganizationMemberSchema.index(
  { organizationId: 1, userId: 1 },
  { unique: true },
);

export const OrganizationMember = mongoose.model(
  "OrganizationMember",
  OrganizationMemberSchema,
);
