import axios from "axios";

// If VITE_API_URL is "https://.../api", use it directly. 
// Otherwise, fall back to the production URL.
const baseURL = import.meta.env.VITE_API_URL || "https://task-tracker-qzrd.onrender.com/api";

const API = axios.create({
  // Use baseURL directly as it should already contain the /api prefix
  baseURL: baseURL, 
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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