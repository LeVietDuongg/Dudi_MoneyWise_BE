import type { Request, Response } from "express";
import ServiceCategory from "../models/ServiceCategory.model.js";

/**
 * 🟢 CREATE CATEGORY
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new ServiceCategory(req.body);
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * 🟢 GET ALL CATEGORIES
 */
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await ServiceCategory.find().sort({ createdAt: -1 });
    res.json({ categories });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🟢 GET CATEGORY BY ID
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ category });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🟢 UPDATE CATEGORY
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category updated", category });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🟢 DELETE CATEGORY
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await ServiceCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
