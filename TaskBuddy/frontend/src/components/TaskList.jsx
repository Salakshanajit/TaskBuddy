import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, busyId, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          busy={busyId === task._id}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
