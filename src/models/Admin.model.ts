import { Schema, model, Types } from "mongoose";
import type { Document } from "mongoose";

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  mustResetPassword?: boolean;
  failedAttempts?: number;
  lockUntil?: Date | null;
  tokenVersion?: number;
  twoFA?: {
    enabled: boolean;
    secret?: string; // base32
  };
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    mustResetPassword: { type: Boolean, default: true },
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    tokenVersion: { type: Number, default: 0 },
    twoFA: {
      enabled: { type: Boolean, default: false },
      secret: { type: String, required: false },
    },
  },
  { timestamps: true }
);

export default model<IAdmin>("Admin", AdminSchema);
