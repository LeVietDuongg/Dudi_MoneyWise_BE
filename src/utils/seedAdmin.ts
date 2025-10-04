import bcrypt from "bcrypt";
import Admin from "../models/Admin.model.js";
import logger from "./logger.js";

const seedAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, SALT_ROUNDS } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    logger.warn("Admin seed skipped (missing credentials)");
    return;
  }

  const exists = await Admin.findOne({ email: ADMIN_EMAIL });
  if (exists) {
    logger.info("Admin already exists, skip seeding");
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, Number(SALT_ROUNDS ?? 10));
  await Admin.create({ email: ADMIN_EMAIL, password: hashed, name: ADMIN_NAME });

  logger.info("✅ Admin account created");

  // ⚠️ Xóa ADMIN_PASSWORD khỏi process.env để tránh rò rỉ
  delete process.env.ADMIN_PASSWORD;
};

export default seedAdmin;
