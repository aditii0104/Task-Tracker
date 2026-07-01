const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware"); // Import the middleware

// Routes
router.route("/").get(getTasks).post(protect, createTask); // Protect creation
router.route("/:id").get(getTaskById).put(protect, updateTask).delete(protect, deleteTask); // Protect update/delete

module.exports = router;