import mongoose, { Schema } from "mongoose";
import { ActivityAction } from "@projectpulse/shared";

const ActivityLogSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", index: true },
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: Object.values(ActivityAction),
      required: true,
    },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
