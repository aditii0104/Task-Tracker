require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// Connect to Database
connectDB();

// CORS Configuration
// This supports either a single URL or a comma-separated list of allowed origins
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(",") 
  : ["http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/", (req, res) => res.json({ success: true, message: "API is running" }));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));