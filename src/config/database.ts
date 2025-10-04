import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import logger from "../utils/logger.js";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) throw new Error("MONGO_URI is not defined in .env");

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("MongoDB connected ✅");
  } catch (err) {
    logger.error("MongoDB connection error: " + (err as Error).message);
    process.exit(1);
  }
};
