const FilterBar = ({ filters, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        name="search"
        placeholder="Search by title..."
        value={filters.search}
        onChange={handleChange}
        aria-label="Search tasks"
      />

      <select name="status" value={filters.status} onChange={handleChange} aria-label="Filter by status">
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In progress</option>
        <option value="completed">Completed</option>
      </select>

      <select name="priority" value={filters.priority} onChange={handleChange} aria-label="Filter by priority">
        <option value="all">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select name="sortBy" value={filters.sortBy} onChange={handleChange} aria-label="Sort by">
        <option value="createdAt">Sort: newest</option>
        <option value="dueDate">Sort: due date</option>
        <option value="priority">Sort: priority</option>
        <option value="title">Sort: title</option>
      </select>
    </div>
  );
};

export default FilterBar;
