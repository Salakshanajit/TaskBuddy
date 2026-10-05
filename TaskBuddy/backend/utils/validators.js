const { PRIORITIES, STATUSES } = require('./constants');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isString = (v) => typeof v === 'string';

// Each validator returns { errors: [...], data: {...clean values} }.

const validateRegister = (body = {}) => {
  const errors = [];
  const name = isString(body.name) ? body.name.trim() : '';
  const email = isString(body.email) ? body.email.trim().toLowerCase() : '';
  const password = isString(body.password) ? body.password : '';

  if (!name) errors.push('Name is required.');
  else if (name.length < 2 || name.length > 50) errors.push('Name must be between 2 and 50 characters.');

  if (!email) errors.push('Email is required.');
  else if (!EMAIL_REGEX.test(email)) errors.push('Please enter a valid email address.');

  if (!password) errors.push('Password is required.');
  else if (password.length < 6) errors.push('Password must be at least 6 characters.');
  else if (password.length > 72) errors.push('Password must be at most 72 characters.');

  if (body.confirmPassword !== undefined && body.confirmPassword !== password) {
    errors.push('Passwords do not match.');
  }

  return { errors, data: { name, email, password } };
};

const validateLogin = (body = {}) => {
  const errors = [];
  const email = isString(body.email) ? body.email.trim().toLowerCase() : '';
  const password = isString(body.password) ? body.password : '';

  if (!email) errors.push('Email is required.');
  if (!password) errors.push('Password is required.');

  return { errors, data: { email, password } };
};

// Used for both create (POST) and full update (PUT).
const validateTask = (body = {}) => {
  const errors = [];
  const title = isString(body.title) ? body.title.trim() : '';
  const description = isString(body.description) ? body.description.trim() : '';
  const priority = body.priority || 'Medium';
  const status = body.status || 'Pending';
  const dueDate = body.dueDate ? new Date(body.dueDate) : null;

  if (!title) errors.push('Title is required.');
  else if (title.length > 100) errors.push('Title cannot be longer than 100 characters.');

  if (description.length > 500) errors.push('Description cannot be longer than 500 characters.');

  if (!dueDate) errors.push('Due date is required.');
  else if (Number.isNaN(dueDate.getTime())) errors.push('Due date is not a valid date.');

  if (!PRIORITIES.includes(priority)) errors.push(`Priority must be one of: ${PRIORITIES.join(', ')}.`);
  if (!STATUSES.includes(status)) errors.push(`Status must be one of: ${STATUSES.join(', ')}.`);

  return { errors, data: { title, description, dueDate, priority, status } };
};

const validateStatus = (body = {}) => {
  const errors = [];
  if (!STATUSES.includes(body.status)) errors.push(`Status must be one of: ${STATUSES.join(', ')}.`);
  return { errors, data: { status: body.status } };
};

module.exports = { validateRegister, validateLogin, validateTask, validateStatus };
