import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ───────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "JobConnect Auth Service",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ─────────────────────────────────────
app.use("/api/auth", authRoute);

// ── 404 Handler ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ msg: `Route ${req.originalUrl} not found.` });
});

// ── Global Error Handler ───────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ msg: "Something went wrong. Please try again." });
});

// ── Start Server ───────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Auth Service running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
  });
});
