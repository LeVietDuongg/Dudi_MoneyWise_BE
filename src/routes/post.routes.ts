// src/routes/post.routes.ts
import { Router } from "express";
import {
  getAllPosts,
  getPostsByTopicSlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

const router = Router();

router.get("/", getAllPosts);                // ✅ Lấy tất cả
router.get("/topic/:slug", getPostsByTopicSlug); // ✅ Lấy theo topic slug
router.get("/:id", getPostById);             // ✅ Chi tiết post
router.post("/", createPost);                // ✅ Tạo
router.put("/:id", updatePost);              // ✅ Cập nhật
router.delete("/:id", deletePost);           // ✅ Xóa

export default router;
