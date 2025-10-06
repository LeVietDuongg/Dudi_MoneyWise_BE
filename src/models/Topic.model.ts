import mongoose, { Schema, Document } from "mongoose";

export interface ITopic extends Document {
  slug: string;
  title: string;
  subtitle: string;
  banner: string; // Cloudinary URL hoặc ảnh tĩnh
}

const TopicSchema = new Schema<ITopic>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    banner: { type: String },
  },
  { timestamps: true }
);

export const Topic = mongoose.model<ITopic>("Topic", TopicSchema);
