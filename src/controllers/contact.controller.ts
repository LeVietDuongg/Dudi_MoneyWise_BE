import type { Request, Response } from "express";
import nodemailer from "nodemailer";

export const sendContactMail = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, subject, message, type } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Thiếu địa chỉ email" });
    }

    // Cấu hình transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let mailOptions;

    // 📩 Nếu là đăng ký nhận tin (newsletter)
    if (type === "newsletter") {
      mailOptions = {
        from: `"MoneyWise Newsletter" <${process.env.MAIL_USER}>`,
        to: process.env.COMPANY_MAIL || process.env.MAIL_USER,
        subject: "📰 Đăng ký nhận bản tin mới",
        html: `
          <h2>📢 Có người mới đăng ký nhận bản tin!</h2>
          <p><b>Email:</b> ${email}</p>
          <p>Vui lòng thêm email này vào danh sách nhận thông báo.</p>
        `,
      };
    } 
    // 💬 Nếu là form liên hệ (contact)
    else {
      if (!fullName || !message) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin liên hệ" });
      }

      mailOptions = {
        from: `"MoneyWise Contact" <${process.env.MAIL_USER}>`,
        to: process.env.COMPANY_MAIL || process.env.MAIL_USER,
        subject: `[Liên hệ] ${subject || "Không có tiêu đề"}`,
        html: `
          <h2>📩 Thông tin liên hệ mới</h2>
          <p><b>Họ tên:</b> ${fullName}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Số điện thoại:</b> ${phone || "Không cung cấp"}</p>
          <p><b>Nội dung:</b></p>
          <p>${message}</p>
        `,
      };
    }

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Gửi email thành công!" });

  } catch (error: any) {
    console.error("❌ Lỗi gửi mail:", error);
    res.status(500).json({ success: false, message: "Không thể gửi email", error: error.message });
  }
};