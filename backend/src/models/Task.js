import mongoose, { Schema } from "mongoose";
import { TaskStatus, Priority } from "@projectpulse/shared";

const TaskSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    sprintId: { type: Schema.Types.ObjectId, ref: "Sprint", index: true },
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.BACKLOG,
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
    },
    storyPoints: { type: Number },
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User" },
    epicId: { type: Schema.Types.ObjectId, ref: "Epic" },
    userStoryId: { type: Schema.Types.ObjectId, ref: "UserStory" },
    dueDate: { type: Date },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task", TaskSchema);
