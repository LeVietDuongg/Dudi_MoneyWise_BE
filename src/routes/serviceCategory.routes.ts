import express from "express";
import { createCategory, getAllCategories } from "../controllers/serviceCategory.controller.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getAllCategories);

export default router;
