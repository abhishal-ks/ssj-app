import mongoose, { Schema, models } from "mongoose";

const SessionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Session = models.Session || mongoose.model("Session", SessionSchema);
