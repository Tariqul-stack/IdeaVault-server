import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import { connectDB } from "./lib/db.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";

const app = express();

// Connect DB
await connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "IdeaVault backend running successfully",
  });
});

// Health route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/ideas", ideaRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export default app;