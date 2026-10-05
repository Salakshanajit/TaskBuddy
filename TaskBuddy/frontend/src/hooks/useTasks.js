import { useCallback, useEffect, useState } from 'react';
import * as taskService from '../services/taskService.js';
import { getErrorMessage } from '../utils/helpers.js';

// Owns the list of tasks and keeps it in sync with the API.
// The mutation helpers throw on failure so the calling component can show the error where it makes sense.
export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskService.fetchTasks();
      setTasks(data.tasks);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your tasks.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const replaceTask = (updated) =>
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

  const addTask = async (payload) => {
    const data = await taskService.createTask(payload);
    setTasks((prev) => [data.task, ...prev]);
  };

  const editTask = async (id, payload) => {
    const data = await taskService.updateTask(id, payload);
    replaceTask(data.task);
  };

  const changeStatus = async (id, status) => {
    const data = await taskService.updateTaskStatus(id, status);
    replaceTask(data.task);
  };

  const removeTask = async (id) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return { tasks, loading, error, loadTasks, addTask, editTask, changeStatus, removeTask };
}
