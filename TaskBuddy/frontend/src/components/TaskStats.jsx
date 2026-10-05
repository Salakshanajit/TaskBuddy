import { useMemo } from 'react';

export default function TaskStats({ tasks }) {
  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
      high: tasks.filter((t) => t.priority === 'High').length,
    }),
    [tasks]
  );

  const items = [
    { label: 'Total tasks', value: stats.total, tone: 'total' },
    { label: 'Pending', value: stats.pending, tone: 'pending' },
    { label: 'In progress', value: stats.inProgress, tone: 'in-progress' },
    { label: 'Completed', value: stats.completed, tone: 'completed' },
    { label: 'High priority', value: stats.high, tone: 'high' },
  ];

  return (
    <section className="stats" aria-label="Task statistics">
      {items.map((item) => (
        <div key={item.label} className={`stat stat-${item.tone}`}>
          <span className="stat-value">{item.value}</span>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </section>
  );
}
