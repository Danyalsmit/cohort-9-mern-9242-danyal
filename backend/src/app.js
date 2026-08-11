import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import logger from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from './routes/notesRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get("/", (req, res) => {
  res.send("Welcome to the backend server");
});

app.use("/api/auth", authRoutes);
app.use('/api/notes', notesRoutes);

// 404 handler 
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error handle
app.use((err, req, res, next) => {
  logger.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: statusCode >= 500 ? "Internal server error" : err.message,
  });
});

export default app;