import { useState, useEffect, useCallback, useRef } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import Toast from "./components/Toast";
import * as taskApi from "./api/taskApi";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    sortBy: "createdAt",
    search: "",
  });

  const toastIdRef = useRef(0);

  const pushToast = useCallback((message, type = "success") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status !== "all") params.status = filters.status;
      if (filters.priority !== "all") params.priority = filters.priority;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.search) params.search = filters.search;

      const res = await taskApi.fetchTasks(params);
      setTasks(res.data);
    } catch (err) {
      pushToast(
        err.response?.data?.message || "Could not reach the server. Is the backend running?",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [filters, pushToast]);

  useEffect(() => {
    const debounce = setTimeout(loadTasks, filters.search ? 300 : 0);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTask) {
        const res = await taskApi.updateTask(editingTask._id, formData);
        setTasks((prev) => prev.map((t) => (t._id === res.data._id ? res.data : t)));
        pushToast("Task updated");
        setEditingTask(null);
      } else {
        const res = await taskApi.createTask(formData);
        setTasks((prev) => [res.data, ...prev]);
        pushToast("Task added");
      }
    } catch (err) {
      pushToast(err.response?.data?.message || "Something went wrong while saving", "error");
      throw err;
    }
  };

  const handleToggleComplete = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    // Optimistic update for instant feedback
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t)));
    try {
      const res = await taskApi.updateTask(task._id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t._id === res.data._id ? res.data : t)));
    } catch (err) {
      // Revert on failure
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      pushToast(err.response?.data?.message || "Could not update task status", "error");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => setEditingTask(null);

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t._id !== task._id));
    try {
      await taskApi.deleteTask(task._id);
      pushToast("Task deleted");
    } catch (err) {
      setTasks(prevTasks);
      pushToast(err.response?.data?.message || "Could not delete task", "error");
    }
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="app-shell">
      <header className="console-header">
        <div>
          <h1 className="console-title">
            Task<span>Ledger</span>
          </h1>
          <p className="console-sub">MERN task tracker · REST-backed · live sync</p>
        </div>
        <div className="stat-stamp">
          <b>{completedCount}</b> / {tasks.length} tasks closed
        </div>
      </header>

      <TaskForm onSubmit={handleCreateOrUpdate} editingTask={editingTask} onCancelEdit={handleCancelEdit} />

      <FilterBar filters={filters} onChange={setFilters} />

      <TaskList
        tasks={tasks}
        loading={loading}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
