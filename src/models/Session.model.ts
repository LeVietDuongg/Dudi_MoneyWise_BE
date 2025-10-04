import { Schema, model, Document, Types } from "mongoose";

export interface ISession extends Document {
  adminId: Types.ObjectId;   // 👈 dùng ObjectId thay vì string
  refreshToken: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    refreshToken: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model<ISession>("Session", sessionSchema);
