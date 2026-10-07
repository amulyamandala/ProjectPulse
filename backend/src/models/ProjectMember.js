import mongoose, { Schema } from "mongoose";
import { Role } from "@projectpulse/shared";

const ProjectMemberSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: Object.values(Role), default: Role.DEVELOPER },
  },
  { timestamps: true },
);

ProjectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export const ProjectMember = mongoose.model(
  "ProjectMember",
  ProjectMemberSchema,
);
