import TaskItem from "./TaskItem";

const TaskList = ({ tasks, loading, onToggleComplete, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="empty-state">
        <strong>Loading tasks...</strong>
        <p>Fetching your ledger from the server</p>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="empty-state">
        <strong>No tasks match here</strong>
        <p>Add a task above or adjust your filters</p>
      </div>
    );
  }

  return (
    <div className="ledger">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
