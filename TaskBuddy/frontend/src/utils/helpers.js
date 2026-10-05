export const STATUSES = ['Pending', 'In Progress', 'Completed'];
export const PRIORITIES = ['Low', 'Medium', 'High'];
const PRIORITY_RANK = { Low: 1, Medium: 2, High: 3 };

export const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Created: newest first' },
  { value: 'createdAt-asc', label: 'Created: oldest first' },
  { value: 'dueDate-asc', label: 'Due date: soonest first' },
  { value: 'dueDate-desc', label: 'Due date: latest first' },
  { value: 'priority-desc', label: 'Priority: high to low' },
  { value: 'priority-asc', label: 'Priority: low to high' },
];

// Due dates are stored at UTC midnight, so format them in UTC to avoid off-by-one-day bugs.
export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
    : '-';

export const formatCreated = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

// "2026-10-05T00:00:00.000Z" -> "2026-10-05" (value format for <input type="date">)
export const toInputDate = (iso) => (iso ? iso.slice(0, 10) : '');

export const todayInputDate = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

export const isOverdue = (task) =>
  task.status !== 'Completed' && toInputDate(task.dueDate) < todayInputDate();

// Turns any Axios/network error into a friendly message for the UI.
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.response) {
    const { status, data } = error.response;
    if (data?.message) return data.message;
    if (status === 401) return 'You are not authorized. Please log in again.';
    if (status >= 500) return 'The server had a problem. Please try again later.';
    return fallback;
  }
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (error?.request) return 'Cannot reach the server. Check that the backend is running.';
  return fallback;
};

// Applies search, filters and sorting entirely in the browser so the UI updates instantly.
export const filterAndSortTasks = (tasks, { search, status, priority, sort }) => {
  const term = search.trim().toLowerCase();
  const [field, direction] = sort.split('-');
  const dir = direction === 'asc' ? 1 : -1;

  return tasks.filter((task) => (
    (!term || task.title.toLowerCase().includes(term))
    && (status === 'All' || task.status === status)
    && (priority === 'All' || task.priority === priority)
  )).sort((a, b) => {
    if (field === 'priority') return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * dir;
    const aValue = field === 'dueDate' ? a.dueDate : a.createdAt;
    const bValue = field === 'dueDate' ? b.dueDate : b.createdAt;
    return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * dir;
  });
};

export const statusClass = (status) => status.toLowerCase().replace(/\s+/g, '-');
