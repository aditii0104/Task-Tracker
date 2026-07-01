import axios from "axios";

// Always use the VITE_API_URL, fallback to localhost if needed for local dev
const baseURL = import.meta.env.VITE_API_URL || "https://task-tracker-qzrd.onrender.com";

const API = axios.create({
  baseURL: `${baseURL}/api`, // Ensure /api prefix is here
  withCredentials: true,
});

// Use the same variable name (API) for the interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Use API (uppercase) consistently in these functions
export const fetchTasks = async (params = {}) => {
  const response = await API.get("/tasks", { params });
  return response.data;
};

export const fetchTaskById = async (id) => {
  const response = await API.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await API.post("/tasks", taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await API.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

export default API;