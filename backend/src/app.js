import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import logger from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get("/", (req, res) => {
  res.send("Welcome to the backend server");
});

app.use("/api/auth", authRoutes);

// 404 handler 
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

export default app;