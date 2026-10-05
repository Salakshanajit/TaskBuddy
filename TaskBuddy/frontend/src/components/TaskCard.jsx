import { STATUSES, formatDate, formatCreated, isOverdue, statusClass } from '../utils/helpers.js';

export default function TaskCard({ task, busy, onEdit, onDelete, onStatusChange }) {
  const overdue = isOverdue(task);

  return (
    <article className={`task-card priority-border-${task.priority.toLowerCase()} ${busy ? 'is-busy' : ''}`}>
      <div className="task-card-top">
        <h3 className="task-title">{task.title}</h3>
        <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>

      <p className="task-description">{task.description || 'No description.'}</p>

      <dl className="task-meta">
        <div>
          <dt>Due</dt>
          <dd className={overdue ? 'overdue' : ''}>
            {formatDate(task.dueDate)}
            {overdue ? ' (overdue)' : ''}
          </dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatCreated(task.createdAt)}</dd>
        </div>
      </dl>

      <div className="task-status-row">
        <span className={`badge status-${statusClass(task.status)}`}>{task.status}</span>
        <select
          aria-label={`Change status of ${task.title}`}
          value={task.status}
          disabled={busy}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="task-actions">
        <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="btn btn-danger-outline btn-sm" disabled={busy} onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </article>
  );
}
