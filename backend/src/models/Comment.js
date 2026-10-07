import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    entityType: { type: String, enum: ["Task", "Issue"], required: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Comment = mongoose.model("Comment", CommentSchema);
