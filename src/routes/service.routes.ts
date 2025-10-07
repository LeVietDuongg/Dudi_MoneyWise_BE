import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByCategory
} from "../controllers/service.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ✅ POST /api/services
router.post("/", upload.single("image"), createService);

// ✅ GET /api/services
router.get("/", getAllServices);
// ✅ 🆕 GET /api/services/category/:categoryId
router.get("/category/:categoryId", getServicesByCategory);

// ✅ GET /api/services/:id
router.get("/:id", getServiceById);

// ✅ PUT /api/services/:id
router.put("/:id", upload.single("image"), updateService);

// ✅ DELETE /api/services/:id
router.delete("/:id", deleteService);

export default router;
