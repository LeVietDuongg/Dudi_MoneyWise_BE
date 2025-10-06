import type { Request, Response } from "express";
import  {Topic}  from "../models/Topic.model.js";
import  {Post} from "../models/Post.model.js";

// 🟢 Lấy tất cả topic
export const getAllTopics = async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json({ success: true, topics });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟢 Lấy 1 topic theo slug + các bài post
export const getTopicBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const topic = await Topic.findOne({ slug });
    if (!topic)
      return res.status(404).json({ success: false, message: "Topic not found" });

    const posts = await Post.find({ topic: topic._id });
    res.json({ success: true, topic, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟢 Tạo topic
export const createTopic = async (req: Request, res: Response) => {
  try {
    const { slug, title, subtitle, banner } = req.body;
    const topic = await Topic.create({ slug, title, subtitle, banner });
    res.status(201).json({ success: true, topic });
  } catch (err) {
    res.status(400).json({ success: false, message: "Cannot create topic" });
  }
};

// 🟡 Cập nhật topic
export const updateTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Topic.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, topic: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: "Cannot update topic" });
  }
};

// 🔴 Xóa topic
export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Topic.findByIdAndDelete(id);
    res.json({ success: true, message: "Topic deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Cannot delete topic" });
  }
};
