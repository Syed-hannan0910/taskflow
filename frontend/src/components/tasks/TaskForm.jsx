import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const defaultForm = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', tags: '' };

export default function TaskForm({ task, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        tags: task.tags?.join(', ') || '',
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [task]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length < 3) e.title = 'Title must be at least 3 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Title *" placeholder="Task title..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} error={errors.title} />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Description</label>
        <textarea
          className="input-field resize-none h-24 text-sm"
          placeholder="Optional description..."
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-field text-sm cursor-pointer">
            <option value="todo" className="bg-slate-800">To Do</option>
            <option value="in-progress" className="bg-slate-800">In Progress</option>
            <option value="completed" className="bg-slate-800">Completed</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Priority</label>
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="input-field text-sm cursor-pointer">
            <option value="low" className="bg-slate-800">Low</option>
            <option value="medium" className="bg-slate-800">Medium</option>
            <option value="high" className="bg-slate-800">High</option>
          </select>
        </div>
      </div>

      <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="text-sm" />

      <Input label="Tags (comma-separated)" placeholder="design, urgent, frontend" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="text-sm" />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{task ? 'Update Task' : 'Create Task'}</Button>
      </div>
    </form>
  );
}