import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import { authorizeAdmin } from "./middlewares/authorizeAdmin.js";
import authenticate from "./middlewares/authMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import registerChatSocket from "./sockets/chatSocket.js";
import notificationRouter from "./routes/notificationRoutes.js";

const app = express();

// Trust proxy to allow secure cookies to be set when behind a reverse proxy (like Vercel, Render, etc.)
app.set("trust proxy", 1);

const httpServer = createServer(app);
const port = Number(process.env.PORT || 3000);
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "https://dev-link-frontend-mu.vercel.app",
];

const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
      .map((origin) => origin.trim().replace(/\/$/, ""))
      .filter(Boolean)
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Non-browser clients (curl, Postman, server-to-server)
  const normalized = origin.replace(/\/$/, "");
  if (allowedOrigins.includes(normalized)) return true;
  // Allow all Vercel preview deployments for the frontend
  if (/^https:\/\/dev-link-frontend[a-zA-Z0-9-]*\.vercel\.app$/.test(normalized)) {
    return true;
  }
  // In development, allow any localhost/127.0.0.1 port
  if (
    process.env.NODE_ENV !== "production" &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized)
  ) {
    return true;
  }
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

app.use(cors(corsOptions));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

// Health check route - responds immediately without waiting for DB
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "DevLink API is online",
    database: mongoose.connection?.readyState === 1 ? "connected" : "connecting/idle",
  });
});

// Ensure database is connected before handling data requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("Database connection error in request:", err.message);
    return res.status(500).json({
      success: false,
      error: "Database connection failed",
      message: err.message,
      help: "Ensure MONGODB_URI is correctly configured in your Vercel Environment Variables.",
    });
  }
});

app.use("/users", userRouter);
app.use("/profile", profileRouter);
app.use("/projects", projectRouter);
app.use("/chats", chatRouter);
app.use("/notifications", notificationRouter);

app.get("/admin", authorizeAdmin, (req, res) => {
  res.send("Welcome, admin!");
});

app.get("/check-cookie", authenticate, (req, res) => {
  res.send({ cookie: req.cookies, me: req.user });
});

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectToDatabase();
    registerChatSocket(io);
    httpServer.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Start listening if running as a standalone Node server (local or traditional host)
if (!process.env.VERCEL) {
  startServer();
}

export default app;

// DB_HOST=localhost
// DB_PORT=3306
// DB_USER=root
// DB_PASSWORD=1234
// DB_NAME=devlink
