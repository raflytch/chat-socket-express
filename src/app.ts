import express from "express";
import { createServer } from "http";
import { config } from "./configs/environment";
import userRoutes from "./routes/user.route";
import { initializeSocket } from "./libs/socket";

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

/**
 * Routes
 */
app.use("/api/users", userRoutes);

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
