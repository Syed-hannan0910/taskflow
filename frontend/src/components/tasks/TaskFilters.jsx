export default function TaskFilters({ filters, onChange }) {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          className="input-field pl-10 h-10 text-sm"
        />
      </div>

      {/* Status filter */}
      <select
        value={filters.status}
        onChange={e => onChange({ ...filters, status: e.target.value })}
        className="input-field h-10 text-sm w-auto min-w-32 cursor-pointer"
      >
        {statusOptions.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
      </select>

      {/* Priority filter */}
      <select
        value={filters.priority}
        onChange={e => onChange({ ...filters, priority: e.target.value })}
        className="input-field h-10 text-sm w-auto min-w-32 cursor-pointer"
      >
        {priorityOptions.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
      </select>

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={e => onChange({ ...filters, sortBy: e.target.value })}
        className="input-field h-10 text-sm w-auto min-w-36 cursor-pointer"
      >
        {sortOptions.map(o => <option key={o.value} value={o.value} className="bg-slate-800">Sort: {o.label}</option>)}
      </select>
    </div>
  );
}