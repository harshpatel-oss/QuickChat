import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import { attachSocketServer } from "./lib/socket.js";

// create express app and http server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server and handlers
attachSocketServer(server);

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes Setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is listening on PORT:" + PORT));


