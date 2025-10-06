import { Schema, model, Document } from "mongoose";

export interface IServiceCategory extends Document {
  name: string;
  description?: string;
}

const ServiceCategorySchema = new Schema<IServiceCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default model<IServiceCategory>("ServiceCategory", ServiceCategorySchema);
