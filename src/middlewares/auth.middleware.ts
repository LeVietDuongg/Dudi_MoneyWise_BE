import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

export interface AuthRequest extends Request {
  user?: { id: string; role: string; tokenVersion?: number };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as { id: string; role: string; tokenVersion?: number };

    // ensure admin exists and tokenVersion matches
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: "Invalid token" });

    if ((admin.tokenVersion ?? 0) !== (decoded.tokenVersion ?? 0)) {
      return res.status(401).json({ message: "Token revoked" });
    }

    if (decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
