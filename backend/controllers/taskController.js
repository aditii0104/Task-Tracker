const mongoose = require("mongoose");
const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy, order, search } = req.query;
    
    // STRICT: Only get tasks for the authenticated user
    const filter = { userId: req.user.id }; 
    
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
    const task = await Task.findOne({ _id: id, userId: req.user.id });
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
      userId: req.user.id
    };
    const task = await Task.create(taskData);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    // Find task by ID AND ensure it belongs to the logged-in user
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      { $set: req.body }, 
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
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
