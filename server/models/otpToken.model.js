import { otpTokens } from "../config/db.js";

export async function createOTP({ email, otp, expiresAt }) {
  await otpTokens().deleteMany({ email });
  return await otpTokens().insertOne({
    email,
    otp,
    expiresAt,
    createdAt: new Date(),
  });
}

export async function findValidOTP({ email, otp }) {
  return await otpTokens().findOne({
    email,
    otp,
    expiresAt: { $gt: new Date() },
  });
}

export async function deleteOTPByEmail(email) {
  return await otpTokens().deleteMany({ email });
}