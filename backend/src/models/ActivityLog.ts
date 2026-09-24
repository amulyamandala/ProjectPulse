import mongoose, { Schema, Document } from 'mongoose';
import { ActivityAction } from '@projectpulse/shared';

export interface IActivityLog extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId;
  action: ActivityAction;
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  metadata?: any;
  createdAt: Date;
}

const ActivityLogSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: Object.values(ActivityAction), required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
