import mongoose, { Schema } from "mongoose";

const TeamMemberSchema = new Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

TeamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

export const TeamMember = mongoose.model("TeamMember", TeamMemberSchema);
