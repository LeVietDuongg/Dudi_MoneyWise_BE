import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import postRoutes from "./routes/post.routes.js";
import serviceRoutes from "./routes/service.routes.js"
import serviceCategoryRoutes from "./routes/serviceCategory.routes.js"
import  seedAdmin  from "./utils/seedAdmin.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();

// Basic security headers
app.use(helmet());

// CORS — tighten in production to your admin UI origin
app.use(cors({ origin: process.env.ADMIN_UI_ORIGIN ?? "*" }));

// Global rate limiter (optional)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200
});
app.use(globalLimiter);

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-categories", serviceCategoryRoutes);
// error handlers...
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error("Unhandled error: " + (err as Error).message);
  res.status(500).json({ message: "Server error" });
});

// DB connect + seed
connectDB().then(() => seedAdmin()).catch(err => {
  logger.error("DB connect failed: " + (err as Error).message);
});

export default app;
