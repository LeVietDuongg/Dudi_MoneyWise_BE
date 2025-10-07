import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Upload nhiều field
const multiUpload = upload.fields([
  { name: "icon", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

router.post("/", multiUpload, createService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.put("/:id", multiUpload, updateService);
router.delete("/:id", deleteService);

export default router;
