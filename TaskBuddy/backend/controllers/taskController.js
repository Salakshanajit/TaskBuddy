const mongoose = require('mongoose');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { PRIORITIES, STATUSES, PRIORITY_RANK } = require('../utils/constants');
const { validateTask, validateStatus } = require('../utils/validators');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Loads a task and makes sure the logged-in user owns it.
//  - invalid id      -> 400
//  - doesn't exist   -> 404
//  - belongs to someone else -> 403
const findOwnedTask = async (id, userId) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid task id.');

  const task = await Task.findById(id);
  if (!task) throw new ApiError(404, 'Task not found.');
  if (task.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not allowed to access this task.');
  }
  return task;
};

// GET /api/tasks  (optional query: status, priority, search, sortBy, order)
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;
  const filter = { user: req.user._id };

  if (status && STATUSES.includes(status)) filter.status = status;
  if (priority && PRIORITIES.includes(priority)) filter.priority = priority;
  if (search && typeof search === 'string') filter.title = { $regex: escapeRegex(search.trim()), $options: 'i' };

  const direction = order === 'asc' ? 1 : -1;
  let tasks;

  if (sortBy === 'priority') {
    // Priority is text, so rank it manually (Low < Medium < High).
    tasks = await Task.find(filter).select('-__v').lean();
    tasks.sort((a, b) => (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * direction);
  } else {
    const sortField = sortBy === 'dueDate' ? 'dueDate' : 'createdAt';
    tasks = await Task.find(filter).select('-__v').sort({ [sortField]: direction }).lean();
  }

  res.status(200).json({ success: true, count: tasks.length, tasks });
});

// GET /api/tasks/:id
const getTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  res.status(200).json({ success: true, task });
});

// POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { errors, data } = validateTask(req.body);
  if (errors.length) throw new ApiError(400, errors[0], errors);

  const task = await Task.create({ ...data, user: req.user._id });
  res.status(201).json({ success: true, message: 'Task created.', task });
});

// PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);

  const { errors, data } = validateTask(req.body);
  if (errors.length) throw new ApiError(400, errors[0], errors);

  Object.assign(task, data);
  await task.save();

  res.status(200).json({ success: true, message: 'Task updated.', task });
});

// PATCH /api/tasks/:id/status
const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);

  const { errors, data } = validateStatus(req.body);
  if (errors.length) throw new ApiError(400, errors[0], errors);

  task.status = data.status;
  await task.save();

  res.status(200).json({ success: true, message: 'Status updated.', task });
});

// DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  await task.deleteOne();
  res.status(200).json({ success: true, message: 'Task deleted.', id: req.params.id });
});

module.exports = { getTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask };
