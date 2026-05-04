import express from "express";
import multer from "multer";
import path from "path";
import {
  handleChat,
  handleFileUpload,
} from "../controllers/chatControllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Multer config (preserve extension so downstream services can validate file type)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

// Protected chat route - requires valid JWT token
router.post("/chat", verifyToken, upload.single("file"), handleChat);

// Protected file upload route - returns file path for socket analysis
router.post("/upload", verifyToken, upload.single("file"), handleFileUpload);

export default router;
