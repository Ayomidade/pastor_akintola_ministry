import { Router } from "express";
import { register, login, getMe } from "../controllers/visitor.controller.js";
import { isVisitor } from "../middlewares/visitorAuth.middleware.js";

const router = Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/me", isVisitor, getMe);

export default router;
