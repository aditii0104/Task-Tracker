const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const isCompleted = task.status === "completed";

  return (
    <div className={`task-row priority-${task.priority} ${isCompleted ? "completed" : ""}`}>
      {isCompleted && <span className="stamp">DONE</span>}

      <button
        className={`task-check ${isCompleted ? "checked" : ""}`}
        onClick={() => onToggleComplete(task)}
        aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
        title={isCompleted ? "Mark as pending" : "Mark as completed"}
      >
        {isCompleted ? "✓" : ""}
      </button>

      <div className="task-body">
        <div className="task-title-row">
          <h3 className="task-title">{task.title}</h3>
        </div>

        {task.description && <p className="task-desc">{task.description}</p>}

        <div className="task-meta">
          <span className={`pill status-${task.status}`}>{task.status.replace("-", " ")}</span>
          <span className="pill">{task.priority} priority</span>
          {task.dueDate && <span className="pill due">due {formatDate(task.dueDate)}</span>}
        </div>
      </div>

      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit">
          ✎
        </button>
        <button
          className="icon-btn danger"
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
