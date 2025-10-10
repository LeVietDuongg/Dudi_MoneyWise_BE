import express from "express";
import type  { Request, Response, NextFunction } from "express"
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import postRoutes from "./routes/post.routes.js";
import serviceRoutes from "./routes/service.routes.js";

import seedAdmin from "./utils/seedAdmin.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();

const isDev = process.env.NODE_ENV !== "production";

// Security middleware with relaxed CSP for dev to unblock asset loading
const helmetConfig = isDev
  ? { contentSecurityPolicy: false }
  : {
      contentSecurityPolicy: {
        directives: {
          ...(helmet.contentSecurityPolicy?.getDefaultDirectives?.() ?? {}),
          defaultSrc: ["'self'"],
          imgSrc: [
            "'self'",
            "data:",
            "https://res.cloudinary.com",
            "https://scr.vn",
            "https://openend.vn",
            "https://www.citd.vn",
          ],
          connectSrc: [
            "'self'",
            process.env.ADMIN_UI_ORIGIN || "http://localhost:3000",
          ],
        },
      },
    };

app.use(helmet(helmetConfig));

// ✅ CORS cấu hình chuẩn cho frontend dùng withCredentials
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001", 
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Rate limiter
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 200,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/services", serviceRoutes);

// ✅ Error handler có type rõ ràng
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled error: " + (err.message || err));
  res.status(500).json({ message: "Server error" });
});

// DB connect + seed admin
connectDB()
  .then(() => seedAdmin())
  .catch((err: Error) => logger.error("DB connect failed: " + (err.message || err)));

export default app;
