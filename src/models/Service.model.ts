import { Schema, model, Document, Types } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  content?: string;
  image?: string;
  category?: Types.ObjectId;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String },
    image: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "ServiceCategory" },
  },
  { timestamps: true }
);

export default model<IService>("Service", ServiceSchema);
