import type { Request, Response } from "express";
import Service from "../models/Service.model.js";
import { cloudinary } from "../config/cloudinary.js";

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

// ✅ Create service (upload icon + image)
export const createService = async (req: Request, res: Response) => {
  try {
    const { title, description, content } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const iconUrl = (req.files as any)?.icon?.[0]?.path || null;
    const imageUrl = (req.files as any)?.image?.[0]?.path || null;

    const service = new Service({
      title,
      description,
      content,
      icon: iconUrl,
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
    const services = await Service.find({}, "title description icon image").sort({ createdAt: -1 });
    res.json({ services });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get service by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ service });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update service
export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Cập nhật icon
    if ((req.files as any)?.icon?.[0] && service.icon) {
      const publicId = getPublicIdFromUrl(service.icon);
      if (publicId) await cloudinary.uploader.destroy(publicId);
      service.icon = (req.files as any).icon[0].path;
    }

    // Cập nhật image
    if ((req.files as any)?.image?.[0] && service.image) {
      const publicId = getPublicIdFromUrl(service.image);
      if (publicId) await cloudinary.uploader.destroy(publicId);
      service.image = (req.files as any).image[0].path;
    }

    service.title = req.body.title ?? service.title;
    service.description = req.body.description ?? service.description;
    service.content = req.body.content ?? service.content;

    await service.save();
    res.json({ message: "Service updated", service });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    for (const field of ["icon", "image"]) {
      const url = (service as any)[field];
      if (url) {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    }

    await service.deleteOne();
    res.json({ message: "Service deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
