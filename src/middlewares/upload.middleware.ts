import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "services",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  }),
});

export const upload = multer({ storage });
// 🟢 Upload cho bài viết (post)
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: async()=>({
    folder: "posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  }),
});
export const uploadPost = multer({ storage: postStorage });
//banner
const bannerStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "banners",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});
export const uploadBanner = multer({ storage: bannerStorage });
