import mongoose, { Schema } from "mongoose";

const RefreshTokenSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
    isRevoked: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
