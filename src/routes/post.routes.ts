import { Router } from "express";
import {
  getPostsByTopicSlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

const router = Router();

router.get("/topic/:slug", getPostsByTopicSlug);
router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
