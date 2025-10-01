import express from "express";
import { createServer } from "http";
import path from "path";
import { config } from "./configs/environment";
import userRoutes from "./routes/user.route";
import { initializeSocket } from "./libs/socket";
import cors from "cors";

const app = express();
const server = createServer(app);

/**
 * Initialize Socket.IO
 */
initializeSocket(server);

/**
 * Middleware
 */
app.use(express.json());
app.use(cors());

/**
 * Serve static files
 */
app.use(express.static(path.join(__dirname, "..")));

/**
 * Routes
 */
app.use("/api/users", userRoutes);

/**
 * Serve index.html
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

/**
 * Start server
 */
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
