import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import http from "http";

import { connectDB } from "./lib/db.js";
import { attachSocketServer } from "./lib/socket.js";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import groupRouter from "./routes/group.route.js";
import aiRouter from "./routes/ai.route.js";

import { CLIENT_URL } from "./config/index.js";

const app = express();
const server = http.createServer(app);

// Attach Socket.IO
attachSocketServer(server);

// ================= Security =================

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ================= Body Parsers =================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ================= Cookies =================

app.use(cookieParser());

// ================= Health Check =================

app.get("/api/status", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is live",
  });
});

// ================= Routes =================

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);
app.use("/api/chat/ai", aiRouter);

// ================= 404 =================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================= Error Handler =================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// ================= Start Server =================

const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("❌ Database connection failed");
  console.error(error);
  process.exit(1);
}