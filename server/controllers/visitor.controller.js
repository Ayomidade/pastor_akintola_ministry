// controllers/visitor.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findVisitorByEmail,
  findVisitorById,
  createVisitor,
} from "../models/visitor.model.js";
import dotenv from "dotenv";

dotenv.config();

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters." });
  }

  try {
    const existing = await findVisitorByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await createVisitor({ name, email, passwordHash });

    return res
      .status(201)
      .json({ message: "Registration successful. Please log in." });
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
    const visitor = await findVisitorByEmail(email);
    if (!visitor) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, visitor.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: visitor._id.toString(), name: visitor.name, email: visitor.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      visitor: { id: visitor._id, name: visitor.name, email: visitor.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getMe(req, res) {
  try {
    const visitor = await findVisitorById(req.visitor.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found." });
    }
    const { passwordHash, ...safe } = visitor;
    return res.status(200).json({ visitor: safe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
