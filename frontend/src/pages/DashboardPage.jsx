import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, pagination, loading, fetchTasks, createTask, updateTask, deleteTask, deleteCompleted } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', sortBy: 'createdAt' });

  const loadTasks = useCallback(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status !== 'all') params.status = filters.status;
    if (filters.priority !== 'all') params.priority = filters.priority;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    fetchTasks(params);
  }, [filters, fetchTasks]);

  useEffect(() => {
    const delay = setTimeout(loadTasks, 300);
    return () => clearTimeout(delay);
  }, [loadTasks]);

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingTask) await updateTask(editingTask._id, data);
      else await createTask(data);
      setShowModal(false);
      setEditingTask(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, color: 'from-blue-600 to-blue-700', icon: '📋', glow: 'shadow-blue-500/20' },
    { label: 'To Do', value: stats.todo, color: 'from-slate-600 to-slate-700', icon: '⏳', glow: 'shadow-slate-500/20' },
    { label: 'In Progress', value: stats.inProgress, color: 'from-amber-600 to-orange-600', icon: '🔄', glow: 'shadow-amber-500/20' },
    { label: 'Completed', value: stats.completed, color: 'from-emerald-600 to-green-600', icon: '✅', glow: 'shadow-emerald-500/20' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
                <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
              </h1>
              <p className="text-slate-400 mt-1">Here's what's on your plate today</p>
            </div>
            <Button onClick={() => { setEditingTask(null); setShowModal(true); }} className="hidden sm:flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className={`glass rounded-2xl p-5 shadow-lg ${card.glow} hover:scale-[1.02] transition-transform duration-200`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{card.icon}</span>
                  <span className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                    {card.value}
                  </span>
                </div>
                <p className="text-sm text-slate-400 font-medium">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {stats.total > 0 && (
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">Overall Progress</span>
                <span className="text-sm font-bold gradient-text">{completionRate}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">{stats.completed} of {stats.total} tasks completed</p>
            </div>
          )}

          {/* Task List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Tasks</h2>
              <div className="flex gap-2">
                {stats.completed > 0 && (
                  <Button variant="ghost" onClick={deleteCompleted} className="text-xs text-slate-400">
                    Clear Completed
                  </Button>
                )}
                <Button onClick={() => { setEditingTask(null); setShowModal(true); }} className="sm:hidden text-sm px-4 py-2">
                  + New
                </Button>
              </div>
            </div>

            {/* Filters */}
            <TaskFilters filters={filters} onChange={setFilters} />

            {/* Task cards */}
            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner size="lg" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-16 glass rounded-2xl">
                <div className="text-5xl mb-4">
                  {filters.search || filters.status !== 'all' || filters.priority !== 'all' ? '🔍' : '📝'}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {filters.search || filters.status !== 'all' || filters.priority !== 'all' ? 'No tasks match your filters' : 'No tasks yet'}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first task to get started'}
                </p>
                {!filters.search && filters.status === 'all' && filters.priority === 'all' && (
                  <Button onClick={() => setShowModal(true)}>Create First Task</Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
                {pagination && pagination.pages > 1 && (
                  <p className="text-center text-sm text-slate-500 pt-4">
                    Showing {tasks.length} of {pagination.total} tasks
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingTask(null); }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
}