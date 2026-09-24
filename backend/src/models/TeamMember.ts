import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  teamId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const TeamMemberSchema = new Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

TeamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
