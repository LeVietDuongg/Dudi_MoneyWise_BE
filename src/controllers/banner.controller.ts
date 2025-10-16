import type { Request, Response } from "express";
import { Banner } from "../models/Banner.model.js";

// 🟩 Lấy tất cả banner
export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟦 Lấy banner theo position
export const getBannersByPosition = async (req: Request, res: Response) => {
  try {
    const { position } = req.params;
    const banners = await Banner.find({ position, isActive: true }).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟨 Tạo mới banner
export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, link, position, order } = req.body;
    const imageUrl =
      (req.file as any)?.path ||
      (req.file as any)?.secure_url ||
      (req.file as any)?.url;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image upload failed" });
    }

    const banner = await Banner.create({
      title,
      link,
      position,
      order,
      imageUrl,
    });

    return res.status(201).json({ success: true, banner });
  } catch (err: any) {
    console.error("❌ Lỗi khi tạo banner:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// 🟧 Cập nhật banner
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, link, position, order, isActive } = req.body;

    const updateData: any = { title, link, position, order, isActive };
    const imageUrl =
      (req.file as any)?.path ||
      (req.file as any)?.secure_url ||
      (req.file as any)?.url;

    if (imageUrl) updateData.imageUrl = imageUrl;

    const updated = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    return res.json({ success: true, banner: updated });
  } catch (err: any) {
    console.error("❌ Lỗi khi cập nhật banner:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// 🟥 Xóa banner
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Banner.findByIdAndDelete(id);
    res.json({ success: true, message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
