import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { createRedisConnection } from "./services/redisClient.js";
import { RedisRateLimitStore } from "./services/redisRateLimitStore.js";

const app = express();

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const maxRequests = Number(process.env.RATE_LIMIT_MAX || 100);

let rateLimitStore;

try {
  const redisClient = await createRedisConnection();
  rateLimitStore = new RedisRateLimitStore({
    client: redisClient,
    windowMs,
    prefix: "rate-limit:",
  });
  console.log("Rate limiter: Redis store enabled");
} catch (error) {
  console.error(
    "Rate limiter: Redis unavailable, using memory store",
    error.message,
  );
}

const apiRateLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
  ...(rateLimitStore ? { store: rateLimitStore } : {}),
});

app.use(cors());
app.use(express.json());
app.use(apiRateLimiter);

// Auth routes (login, register, logout)
app.use("/auth", authRoutes);

// Chat routes (requires authentication)
app.use("/", chatRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
