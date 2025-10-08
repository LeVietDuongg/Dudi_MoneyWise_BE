import type { Request, Response } from "express";
import { Post } from "../models/Post.model.js";
import { Topic } from "../models/Topic.model.js";
// 🟢 Lấy tất cả bài viết
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("topic");
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// 🟢 Lấy tất cả post theo topic slug
export const getPostsByTopicSlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const topic = await Topic.findOne({ slug });
    if (!topic)
      return res.status(404).json({ success: false, message: "Topic not found" });

    const posts = await Post.find({ topic: topic._id });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟢 Lấy chi tiết 1 post theo id
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("topic");
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟢 Tạo post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { topicSlug, title, excerpt, author, type, image, videoUrl, content, contentBeforeVideo, contentAfterVideo } =
      req.body;

    const topic = await Topic.findOne({ slug: topicSlug });
    if (!topic)
      return res.status(404).json({ success: false, message: "Topic not found" });

    const post = await Post.create({
      topic: topic._id,
      title,
      excerpt,
      author,
      type,
      image,
      videoUrl,
      content,
      contentBeforeVideo,
      contentAfterVideo,
    });

    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(400).json({ success: false, message: "Cannot create post" });
  }
};

// 🟡 Cập nhật post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, post: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: "Cannot update post" });
  }
};

// 🔴 Xóa post
export const deletePost = async (req: Request, res: Response) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Cannot delete post" });
  }
};
