import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";
import Session from "../models/Session.model.js";
import logger from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "15m") as jwt.SignOptions["expiresIn"];
const REFRESH_EXPIRES_IN = (process.env.REFRESH_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];

if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: admin._id.toString(), role: "admin" };

    // Access token
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Refresh token
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

    await Session.create({
      adminId: admin._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    logger.error("Login error: " + (err as Error).message);
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Missing refresh token" });

    const session = await Session.findOne({ refreshToken });
    if (!session) return res.status(403).json({ message: "Invalid session" });

    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string; role: string };

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    logger.error("Refresh error: " + (err as Error).message);
    next(err);
  }
};
