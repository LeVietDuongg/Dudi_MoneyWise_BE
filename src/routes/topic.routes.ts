import { Router } from "express";
import {
  getAllTopics,
  getTopicBySlug,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller.js";

const router = Router();

router.get("/", getAllTopics);
router.get("/:slug", getTopicBySlug);
router.post("/", createTopic);
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);

export default router;
