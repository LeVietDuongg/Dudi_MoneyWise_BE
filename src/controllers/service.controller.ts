import type { Request, Response } from "express";
import Service from "../models/Service.model.js";
import { cloudinary } from "../config/cloudinary.js";

// ✅ Helper: Lấy public_id từ Cloudinary URL
const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    return `${folder}/${fileName.split(".")[0]}`;
  } catch {
    return null;
  }
};

// ✅ Create service (upload ảnh mới)
export const createService = async (req: Request, res: Response) => {
  try {
    console.log("🟡 [CreateService] Body:", req.body);
    console.log("🟡 [CreateService] File:", req.file);

    const { title, description, content, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const imageUrl = (req.file as any)?.path || null;

    const service = new Service({
      title,
      description,
      content,
      category,
      image: imageUrl,
    });

    await service.save();
    res.status(201).json({ message: "Service created", service });
  } catch (err: any) {
    console.error("❌ [CreateService] Error:", err);
    res.status(400).json({ message: err.message || "Failed to create service" });
  }
};


// ✅ Get all services
export const getAllServices = async (_req: Request, res: Response) => {
  try {
    const services = await Service.find()
      .populate("category")
      .sort({ createdAt: -1 });
    res.json({ services });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id).populate("category");
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ service });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update service (xóa ảnh cũ nếu có ảnh mới)
export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Nếu có ảnh mới → xóa ảnh cũ trên Cloudinary
    if (req.file && service.image) {
      const publicId = getPublicIdFromUrl(service.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
      service.image = (req.file as any).path;
    }

    service.title = req.body.title ?? service.title;
    service.description = req.body.description ?? service.description;
    service.content = req.body.content ?? service.content;
    service.category = req.body.category ?? service.category;

    await service.save();
    res.json({ message: "Service updated", service });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete service (xóa ảnh Cloudinary)
export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Xóa ảnh Cloudinary nếu có
    if (service.image) {
      const publicId = getPublicIdFromUrl(service.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await service.deleteOne();
    res.json({ message: "Service deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
