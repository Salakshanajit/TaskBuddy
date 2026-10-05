import api from './api.js';

export const fetchTasks = () => api.get('/tasks').then((res) => res.data);
export const fetchTask = (id) => api.get(`/tasks/${id}`).then((res) => res.data);
export const createTask = (data) => api.post('/tasks', data).then((res) => res.data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then((res) => res.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((res) => res.data);
export const updateTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status }).then((res) => res.data);
