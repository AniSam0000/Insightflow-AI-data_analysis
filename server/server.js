import "dotenv/config";
import app from "./src/app.js";
import { getBalanceGrok } from "./src/services/aiService.js";
import { connectDb } from "./src/configs/db.js";
import { setupSocketHandlers } from "./src/socket/socketHandlers.js";
import { startUploadCleanupJob } from "./src/services/uploadCleanupService.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Attach Socket.io to server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
  pingInterval: 30000,
  pingTimeout: 130000,
});

// Setup socket handlers
setupSocketHandlers(io);
startUploadCleanupJob();

// Make io accessible to routes
app.set("io", io);

// Check Groq API connectivity
await getBalanceGrok();

try {
  // Connect to MongoDB
  await connectDb();
  console.log("✓ MongoDB connected successfully");
} catch (error) {
  console.error("✗ MongoDB connection failed:", error.message);
  process.exit(1); // Exit if MongoDB fails
}

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
