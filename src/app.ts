import express from "express";
import { config } from "./configs/environment";
import userRoutes from "./routes/user.route";

const app = express();

/**
 * Middleware
 */
app.use(express.json());

/**
 * Routes
 */
app.use("/api/users", userRoutes);

/**
 * Start server
 */
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
