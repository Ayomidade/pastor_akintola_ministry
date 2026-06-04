import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail({ to, name, otp }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Password Reset OTP — Pastor Daniel Akintola Ministries",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1a1a2e; margin-bottom: 8px;">Password Reset Request</h2>
        <p style="color: #4b5563;">Hello ${name},</p>
        <p style="color: #4b5563;">Use the OTP below to reset your admin password. It expires in <strong>15 minutes</strong>.</p>
        <div style="background: #f3f4f6; border-radius: 6px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 13px;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">Pastor Daniel Akintola Ministries</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
