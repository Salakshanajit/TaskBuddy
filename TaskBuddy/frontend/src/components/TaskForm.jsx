import { useState } from 'react';
import { PRIORITIES, STATUSES, toInputDate, todayInputDate } from '../utils/helpers.js';

// Used for both "New task" (no task prop) and "Edit task" (task prop supplied).
export default function TaskForm({ task, submitting, serverError, onSubmit, onCancel }) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task ? toInputDate(task.dueDate) : todayInputDate(),
    priority: task?.priority || 'Medium',
    status: task?.status || 'Pending',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    else if (form.title.trim().length > 100) next.title = 'Title must be 100 characters or fewer.';
    if (form.description.trim().length > 500) next.description = 'Description must be 500 characters or fewer.';
    if (!form.dueDate) next.dueDate = 'Pick a due date.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      priority: form.priority,
      status: form.status,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form">
      {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" value={form.title} onChange={handleChange} maxLength={100} placeholder="e.g. Finish project report" autoFocus />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} maxLength={500} placeholder="Optional details" />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
          {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
        </div>
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
