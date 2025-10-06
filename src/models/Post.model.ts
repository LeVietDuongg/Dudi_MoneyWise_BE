import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  topic: mongoose.Types.ObjectId;
  title: string;
  excerpt: string;
  author: string;
  type: "image" | "video";
  image?: string;
  videoUrl?: string;
  content?: string;
  contentBeforeVideo?: string;
  contentAfterVideo?: string;
}

const PostSchema = new Schema<IPost>(
  {
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    title: { type: String, required: true },
    excerpt: { type: String },
    author: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    image: { type: String },
    videoUrl: { type: String },
    content: { type: String },
    contentBeforeVideo: { type: String },
    contentAfterVideo: { type: String },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", PostSchema);
