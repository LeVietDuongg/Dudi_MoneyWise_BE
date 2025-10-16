import type { Request, Response } from "express";
import { Post } from "../models/Post.model.js";
import { Topic } from "../models/Topic.model.js";

// 🟢 Lấy tất cả bài viết
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("topic");
    res.json({ success: true, posts });
  } catch (err) {
    console.error("❌ getAllPosts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟢 Lấy post theo topic slug
export const getPostsByTopicSlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const topic = await Topic.findOne({ slug });
    if (!topic)
      return res.status(404).json({ success: false, message: "Topic not found" });

    const posts = await Post.find({ topic: topic._id }).populate("topic");
    res.json({ success: true, posts });
  } catch (err) {
    console.error("❌ getPostsByTopicSlug:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟢 Lấy chi tiết 1 post
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("topic");
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    res.json({ success: true, post });
  } catch (err) {
    console.error("❌ getPostById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟢 Tạo bài viết
export const createPost = async (req: Request, res: Response) => {
  try {
    const {
      topicSlug,
      title,
      excerpt,
      author,
      type,
      videoUrl,
      content,
      contentBeforeVideo,
      contentAfterVideo,
    } = req.body;

    if (!topicSlug || !title || !author)
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu bắt buộc" });

    const topic = await Topic.findOne({ slug: topicSlug });
    if (!topic)
      return res.status(404).json({ success: false, message: "Topic not found" });

    const image = req.file ? (req.file as any).path : null;

    const post = await Post.create({
      topic: topic._id,
      title,
      excerpt,
      author,
      type: type || (videoUrl ? "video" : "image"),
      image,
      videoUrl,
      content,
      contentBeforeVideo,
      contentAfterVideo,
    });

    res.status(201).json({ success: true, post });
  } catch (err: any) {
    console.error("❌ createPost Error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Cannot create post",
      error: err,
    });
  }
};

// 🟡 Cập nhật bài viết
export const updatePost = async (req: Request, res: Response) => {
  try {
    const dataToUpdate: any = { ...req.body };

    if (req.file) dataToUpdate.image = (req.file as any).path;

    const updated = await Post.findByIdAndUpdate(req.params.id, dataToUpdate, {
      new: true,
    }).populate("topic");

    if (!updated)
      return res.status(404).json({ success: false, message: "Post not found" });

    res.json({ success: true, post: updated });
  } catch (err: any) {
    console.error("❌ updatePost:", err.message);
    res.status(500).json({ success: false, message: "Cannot update post" });
  }
};

// 🔴 Xóa bài viết
export const deletePost = async (req: Request, res: Response) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Post not found" });

    res.json({ success: true, message: "Post deleted" });
  } catch (err: any) {
    console.error("❌ deletePost:", err.message);
    res.status(500).json({ success: false, message: "Cannot delete post" });
  }
};
