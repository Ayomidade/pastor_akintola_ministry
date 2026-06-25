import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";

import authRoutes, { setupRouter } from "./routes/auth.routes.js";
import visitorRoutes from "./routes/visitor.routes.js";
import postRoutes from "./routes/post.routes.js";
import sermonRoutes from "./routes/sermon.routes.js";
import ebookRoutes from "./routes/ebook.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import livestreamRoutes from "./routes/livestream.routes.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import eventRoutes from "./routes/event.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(limiter);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
);

// router=express.Router()
// router.get("/setup-status", checkSetupStatus);

app.use("/api/auth/setup-status", setupRouter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/sermons", sermonRoutes);
app.use("/api/ebooks", ebookRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/livestream", livestreamRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  return res.json({
    message: "Pastor Daniel Akintola API is running.",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  // Multer errors (file size, wrong type)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large." });
  }
  if (err.message && err.message.startsWith("Invalid")) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err.stack);
  return res.status(500).json({ message: "Internal server error." });
});

export default app;
