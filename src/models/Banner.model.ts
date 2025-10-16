import { Schema, model, Document } from "mongoose";

export interface IBanner extends Document {
  title: string;
  imageUrl: string;
  link?: string;
  position: "home" | "service" | "about" | "custom"; // có thể mở rộng
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String },
    position: {
      type: String,
      enum: ["home", "service", "about", "custom"],
      default: "home",
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Banner = model<IBanner>("Banner", bannerSchema);
