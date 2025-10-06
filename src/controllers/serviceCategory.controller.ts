import type { Request, Response } from "express";
import ServiceCategory from "../models/ServiceCategory.model.js";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new ServiceCategory(req.body);
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await ServiceCategory.find().sort({ createdAt: -1 });
    res.json({ categories });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
