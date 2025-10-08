// src/routes/topic.routes.ts
import { Router } from "express";
import {
  getAllTopics,
  getTopicBySlug,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller.js";

const router = Router();

router.get("/", getAllTopics);           // ✅ Lấy tất cả topic
router.get("/:slug", getTopicBySlug);    // ✅ Lấy topic + post
router.post("/", createTopic);           // ✅ Tạo topic
router.put("/:id", updateTopic);         // ✅ Cập nhật topic
router.delete("/:id", deleteTopic);      // ✅ Xóa topic

export default router;
