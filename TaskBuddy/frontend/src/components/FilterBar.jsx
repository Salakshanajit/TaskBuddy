import { STATUSES, PRIORITIES, SORT_OPTIONS } from '../utils/helpers.js';

export default function FilterBar({ status, priority, sort, onStatusChange, onPriorityChange, onSortChange }) {
  return (
    <>
      <div className="field">
        <label htmlFor="filter-status">Status</label>
        <select id="filter-status" value={status} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="All">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="filter-priority">Priority</label>
        <select id="filter-priority" value={priority} onChange={(e) => onPriorityChange(e.target.value)}>
          <option value="All">All</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="sort-by">Sort by</label>
        <select id="sort-by" value={sort} onChange={(e) => onSortChange(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </>
  );
}
