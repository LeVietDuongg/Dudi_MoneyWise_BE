import type { Request, Response } from "express";
import Service from "../models/Service.model.js";

export const createService = async (req: Request, res: Response) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ message: "Service created", service });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find().populate("category").sort({ createdAt: -1 });
    res.json({ services });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id).populate("category");
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ service });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service updated", service });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
