import { useCallback, useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import TaskStats from '../components/TaskStats.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import TaskList from '../components/TaskList.jsx';
import TaskForm from '../components/TaskForm.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmationModal from '../components/ConfirmationModal.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Toast from '../components/Toast.jsx';
import useAuth from '../hooks/useAuth.js';
import useTasks from '../hooks/useTasks.js';
import { filterAndSortTasks, getErrorMessage } from '../utils/helpers.js';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, loading, error, loadTasks, addTask, editTask, changeStatus, removeTask } = useTasks();

  // search / filter / sort state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sort, setSort] = useState('createdAt-desc');

  // modal state: null | { task?: Task }  (task present = editing)
  const [formModal, setFormModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  const dismissToast = useCallback(() => setToast(null), []);

  const visibleTasks = useMemo(
    () => filterAndSortTasks(tasks, { search, status, priority, sort }),
    [tasks, search, status, priority, sort]
  );

  const filtersActive = search.trim() !== '' || status !== 'All' || priority !== 'All';

  const clearFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
  };

  const openCreate = () => {
    setFormError('');
    setFormModal({});
  };

  const openEdit = (task) => {
    setFormError('');
    setFormModal({ task });
  };

  const closeForm = () => {
    if (!submitting) setFormModal(null);
  };

  const handleSubmit = async (payload) => {
    const editing = formModal?.task;
    setSubmitting(true);
    setFormError('');
    try {
      if (editing) {
        await editTask(editing._id, payload);
        setToast({ type: 'success', message: 'Task updated.' });
      } else {
        await addTask(payload);
        setToast({ type: 'success', message: 'Task created.' });
      }
      setFormModal(null);
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not save the task.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setBusyId(id);
    try {
      await changeStatus(id, newStatus);
      setToast({ type: 'success', message: `Marked as ${newStatus}.` });
    } catch (err) {
      setToast({ type: 'error', message: getErrorMessage(err, 'Could not update the status.') });
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeTask(deleteTarget._id);
      setToast({ type: 'success', message: 'Task deleted.' });
    } catch (err) {
      setToast({ type: 'error', message: getErrorMessage(err, 'Could not delete the task.') });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  let content;
  if (loading) {
    content = <LoadingSpinner label="Loading your tasks…" />;
  } else if (error) {
    content = (
      <div className="state-box">
        <div className="alert alert-error" role="alert">{error}</div>
        <button type="button" className="btn btn-outline" onClick={loadTasks}>Try again</button>
      </div>
    );
  } else if (tasks.length === 0) {
    content = (
      <div className="state-box">
        <h3>No tasks yet</h3>
        <p className="muted">Add your first task to start tracking what needs to get done.</p>
        <button type="button" className="btn btn-primary" onClick={openCreate}>Create a task</button>
      </div>
    );
  } else if (visibleTasks.length === 0) {
    content = (
      <div className="state-box">
        <h3>No tasks match your filters</h3>
        <p className="muted">Try a different search term or clear the filters.</p>
        <button type="button" className="btn btn-outline" onClick={clearFilters}>Clear filters</button>
      </div>
    );
  } else {
    content = (
      <TaskList
        tasks={visibleTasks}
        busyId={busyId}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="page-head">
          <div>
            <h1>Welcome back, {user?.name}</h1>
            <p className="muted">Here is where your tasks stand today.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={openCreate}>+ New task</button>
        </div>

        <TaskStats tasks={tasks} />

        <section className="toolbar" aria-label="Search and filter tasks">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar
            status={status}
            priority={priority}
            sort={sort}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
            onSortChange={setSort}
          />
        </section>

        {!loading && !error && tasks.length > 0 && (
          <p className="result-count muted">
            Showing {visibleTasks.length} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            {filtersActive && (
              <button type="button" className="link-btn" onClick={clearFilters}>Clear filters</button>
            )}
          </p>
        )}

        {content}
      </main>

      {formModal && (
        <Modal title={formModal.task ? 'Edit task' : 'New task'} onClose={closeForm} locked={submitting}>
          <TaskForm
            task={formModal.task}
            submitting={submitting}
            serverError={formError}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmationModal
          title="Delete this task?"
          message={`"${deleteTarget.title}" will be permanently removed. This cannot be undone.`}
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  );
}
