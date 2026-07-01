import { useState, useEffect } from "react";

const emptyTask = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

const TaskForm = ({ onSubmit, editingTask, onCancelEdit }) => {
  const [formData, setFormData] = useState(emptyTask);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending",
        priority: editingTask.priority || "medium",
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setFormData(emptyTask);
    }
    setErrors({});
  }, [editingTask]);

  const validate = () => {
    const newErrors = {};
    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      newErrors.title = "Title is required";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (trimmedTitle.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (formData.dueDate) {
      const due = new Date(formData.dueDate);
      if (Number.isNaN(due.getTime())) {
        newErrors.dueDate = "Enter a valid date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null,
      });
      if (!editingTask) setFormData(emptyTask);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit} noValidate>
      <h2 className="panel-title">{editingTask ? "Edit task" : "New task"}</h2>
      <div className="form-grid">
        <div className="form-field full">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Finish resume rewrite"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? "has-error" : ""}
            maxLength={100}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-field full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Optional details..."
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "has-error" : ""}
            maxLength={500}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className={errors.dueDate ? "has-error" : ""}
          />
          {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
        </div>

        <div className="form-actions">
          {editingTask && (
            <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : editingTask ? "Save changes" : "Add task"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
