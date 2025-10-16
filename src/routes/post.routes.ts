import { Router } from "express";
import { uploadPost } from "../middlewares/upload.middleware.js";
import {
  getAllPosts,
  getPostsByTopicSlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

const router = Router();

// 🟢 Routes
router.get("/", getAllPosts);
router.get("/topic/:slug", getPostsByTopicSlug);
router.get("/:id", getPostById);

// ⚡ Upload 1 ảnh duy nhất (field name: "image")
router.post("/", uploadPost.single("image"), createPost);
router.put("/:id", uploadPost.single("image"), updatePost);

router.delete("/:id", deletePost);

export default router;
