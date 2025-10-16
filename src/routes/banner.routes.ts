import { Router } from "express";
import { uploadBanner } from "../middlewares/upload.middleware.js";
import {
  getAllBanners,
  getBannersByPosition,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";

const router = Router();

router.get("/", getAllBanners);
router.get("/:position", getBannersByPosition);
router.post("/", uploadBanner.single("image"), createBanner);
router.put("/:id", uploadBanner.single("image"), updateBanner);
router.delete("/:id",  deleteBanner);

export default router;
