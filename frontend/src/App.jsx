import { useCallback, useEffect, useRef, useState } from "react";
import ProfileMenu from "./components/ProfileMenu";
import ProfileButton from "./components/ProfileButton";
import { useAuth } from "./context/AuthContext";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import Toast from "./components/Toast";
import Login from "./Login";
import Register from "./Register";
import * as taskApi from "./api/taskApi";

function App() {
  const { user, loading, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return <TaskDashboard onLogout={logout} />;
}

function TaskDashboard({ onLogout }) {
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
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
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

      const response = await taskApi.fetchTasks(params);
      setTasks(response.data);
    } catch (error) {
      pushToast(error.response?.data?.message || "Could not reach the server. Is the backend running?", "error");
    } finally {
      setLoading(false);
    }
  }, [filters, pushToast]);

  useEffect(() => {
    const delay = filters.search ? 300 : 0;
    const timer = window.setTimeout(() => {
      loadTasks();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [filters, loadTasks]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTask) {
        const response = await taskApi.updateTask(editingTask._id, formData);
        setTasks((prev) => prev.map((task) => (task._id === response.data._id ? response.data : task)));
        setEditingTask(null);
        pushToast("Task updated");
      } else {
        const response = await taskApi.createTask(formData);
        setTasks((prev) => [response.data, ...prev]);
        pushToast("Task added");
      }
    } catch (error) {
      pushToast(error.response?.data?.message || "Something went wrong while saving", "error");
      throw error;
    }
  };

  const handleToggleComplete = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    setTasks((prev) => prev.map((item) => (item._id === task._id ? { ...item, status: nextStatus } : item)));

    try {
      const response = await taskApi.updateTask(task._id, { status: nextStatus });
      setTasks((prev) => prev.map((item) => (item._id === response.data._id ? response.data : item)));
    } catch (error) {
      setTasks((prev) => prev.map((item) => (item._id === task._id ? task : item)));
      pushToast(error.response?.data?.message || "Could not update task status", "error");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => setEditingTask(null);

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;

    const previousTasks = tasks;
    setTasks((prev) => prev.filter((item) => item._id !== task._id));

    try {
      await taskApi.deleteTask(task._id);
      pushToast("Task deleted");
    } catch (error) {
      setTasks(previousTasks);
      pushToast(error.response?.data?.message || "Could not delete task", "error");
    }
  };

  const completedCount = tasks.filter((task) => task.status === "completed").length;

  return (
    <div className="app-shell">
      <header className="console-header">
        <div className="header-left">
          {/* Profile button is now in the left group */}
          <ProfileButton />
          
          <div>
            <h1 className="console-title">
              Task<span>Ledger</span>
            </h1>
            <p className="console-sub">MERN task tracker · REST-backed · live sync</p>
          </div>
        </div>
        
        <div className="header-right">
          <div className="stat-stamp">
            <b>{completedCount}</b> / {tasks.length} tasks closed
          </div>
        </div>
      </header>

      {/* This panel will now be on the LEFT */}
      <div className="task-form-panel">
        <TaskForm 
          onSubmit={handleCreateOrUpdate} 
          editingTask={editingTask} 
          onCancelEdit={handleCancelEdit} 
        />
      </div>

      {/* This list will now be on the RIGHT */}
      <div className="task-list-panel">
        <FilterBar filters={filters} onChange={setFilters} />
        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;