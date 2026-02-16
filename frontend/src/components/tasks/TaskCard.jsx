import { useState } from 'react';
import { priorityConfig, statusConfig, formatDate, isOverdue } from '../../utils/helpers';
import Badge from '../ui/Badge';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [showMenu, setShowMenu] = useState(false);
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const overdue = isOverdue(task.dueDate, task.status);

  const nextStatus = { 'todo': 'in-progress', 'in-progress': 'completed', 'completed': 'todo' };

  return (
    <div className={`glass rounded-xl p-4 hover:bg-white/8 transition-all duration-200 border-l-2 animate-fade-in group ${
      task.status === 'completed' ? 'border-l-emerald-500/50 opacity-75' :
      overdue ? 'border-l-red-500/70' : `border-l-${priority.dot.replace('bg-', '')}`
    }`}
    style={{ borderLeftColor: task.status === 'completed' ? '#10b981' : overdue ? '#ef4444' : task.priority === 'high' ? '#f87171' : task.priority === 'medium' ? '#fbbf24' : '#34d399' }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onStatusChange(task._id, nextStatus[task.status])}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-blue-400'
          }`}
        >
          {task.status === 'completed' && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-sm leading-snug ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'amber' : 'green'}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${priority.dot}`} />
              {priority.label}
            </Badge>
            <Badge variant={task.status === 'completed' ? 'green' : task.status === 'in-progress' ? 'blue' : 'default'}>
              {status.label}
            </Badge>
            {task.dueDate && (
              <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-400' : 'text-slate-400'}`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}
              </span>
            )}
            {task.tags?.map(tag => (
              <span key={tag} className="text-xs text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            onBlur={() => setTimeout(() => setShowMenu(false), 150)}
            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-10 glass rounded-xl shadow-xl border border-white/10 py-1 min-w-32 animate-slide-up">
              <button onClick={() => { onEdit(task); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                Edit
              </button>
              <button onClick={() => { onDelete(task._id); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}