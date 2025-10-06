import { Router } from "express";
import { body } from "express-validator";
import { login, refresh, changePassword } from "../controllers/auth.controller.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// ✅ POST /api/auth/login
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 }),
  validateMiddleware,
  login
);

// ✅ POST /api/auth/change-password
router.post(
  "/change-password",
  authMiddleware,
  body("password").isString().isLength({ min: 6 }),
  validateMiddleware,
  changePassword
);

// ✅ POST /api/auth/refresh
router.post(
  "/refresh",
  body("refreshToken").isString(),
  validateMiddleware,
  refresh
);

export default router;
