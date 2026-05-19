import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { connectDB } from "./lib/db.js";
import ideaRoutes from "./routes/ideaRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/ideas", ideaRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  await connectDB();

  app.listen(port, () => {
    console.log(`IdeaVault server listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start IdeaVault server:", error);
  process.exit(1);
});
