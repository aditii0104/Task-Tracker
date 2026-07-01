const mongoose = require("mongoose");
const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy, order, search } = req.query;
    // Logic: Use req.user.id if authenticated, otherwise filter by existence
    const filter = req.user ? { userId: req.user.id } : { userId: { $exists: false } };
    
    if (status && status !== "all") filter.status = status;
    if (priority && priority !== "all") filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    let sort = { createdAt: -1 };
    if (sortBy) {
      const sortOrder = order === "asc" ? 1 : -1;
      sort = { [sortBy]: sortOrder };
    }

    const tasks = await Task.find(filter).sort(sort);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      userId: req.user ? req.user.id : undefined 
    };
    const task = await Task.create(taskData);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// EXPORTING ALL FUNCTIONS
module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};