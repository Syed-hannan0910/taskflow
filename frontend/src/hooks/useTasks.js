import { useState, useCallback } from 'react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await taskAPI.getAll(params);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    const { data } = await taskAPI.create(taskData);
    setTasks(prev => [data.task, ...prev]);
    toast.success('Task created!');
    return data.task;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await taskAPI.update(id, taskData);
    setTasks(prev => prev.map(t => (t._id === id ? data.task : t)));
    toast.success('Task updated!');
    return data.task;
  };

  const deleteTask = async (id) => {
    await taskAPI.delete(id);
    setTasks(prev => prev.filter(t => t._id !== id));
    toast.success('Task deleted');
  };

  const deleteCompleted = async () => {
    const { data } = await taskAPI.deleteCompleted();
    setTasks(prev => prev.filter(t => t.status !== 'completed'));
    toast.success(data.message);
  };

  return { tasks, pagination, loading, fetchTasks, createTask, updateTask, deleteTask, deleteCompleted };
};