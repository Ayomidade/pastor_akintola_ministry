// controllers/auth.controller.js
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  findAdminByEmail,
  findAdminById,
  adminExists,
  createAdmin,
  updateAdminPassword,
} from "../models/admin.model.js";
import {
  createOTP,
  findValidOTP,
  deleteOTPByEmail,
} from "../models/otpToken.model.js";
import { sendOTPEmail } from "../config/mailer.js";

export async function setupAdmin(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters." });
  }

  try {
    const exists = await adminExists();
    if (exists) {
      return res
        .status(403)
        .json({ message: "Admin account already exists. Setup is disabled." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await createAdmin({ name, email, passwordHash });

    return res
      .status(201)
      .json({ message: "Admin account created. You can now log in." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    req.session.adminId = admin._id.toString();
    req.session.adminName = admin.name;
    req.session.adminEmail = admin.email;

    return res.status(200).json({
      message: "Login successful.",
      admin: { name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed." });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out successfully." });
  });
}

export async function getMe(req, res) {
  try {
    const admin = await findAdminById(req.session.adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    return res.status(200).json({
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new password are required." });
  }
  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "New password must be at least 8 characters." });
  }

  try {
    const admin = await findAdminById(req.session.adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must differ from current password." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await updateAdminPassword({ email: admin.email, passwordHash });

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function requestPasswordResetOTP(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const admin = await findAdminByEmail(email);

    if (!admin) {
      return res
        .status(200)
        .json({
          message: "If this email is registered, an OTP has been sent.",
        });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await createOTP({ email, otp, expiresAt });
    await sendOTPEmail({ to: email, name: admin.name, otp });

    return res
      .status(200)
      .json({ message: "If this email is registered, an OTP has been sent." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function resetPasswordWithOTP(req, res) {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required." });
  }
  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters." });
  }

  try {
    const validOTP = await findValidOTP({ email, otp });
    if (!validOTP) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await updateAdminPassword({ email, passwordHash });
    await deleteOTPByEmail(email);

    return res
      .status(200)
      .json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function checkSetupStatus(req, res) {
  try {
    const exists = await adminExists();
    return res.status(200).json({ isSetupDone: exists });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
