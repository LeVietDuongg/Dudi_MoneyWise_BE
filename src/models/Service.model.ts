import { Schema, model, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  content?: string;
  image?: string; // ảnh banner
  icon?: string;  // icon hiển thị ở trang ngoài
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String },
    image: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

export default model<IService>("Service", ServiceSchema);
