import Modal from './Modal.jsx';

export default function ConfirmationModal({ title, message, confirmLabel = 'Delete', loading, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel} locked={loading}>
      <p className="modal-text">{message}</p>
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
