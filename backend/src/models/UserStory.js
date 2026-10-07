import mongoose, { Schema } from "mongoose";

const UserStorySchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    epicId: { type: Schema.Types.ObjectId, ref: "Epic" },
    title: { type: String, required: true },
    description: { type: String },
    acceptanceCriteria: { type: String },
    storyPoints: { type: Number },
  },
  { timestamps: true },
);

export const UserStory = mongoose.model("UserStory", UserStorySchema);
