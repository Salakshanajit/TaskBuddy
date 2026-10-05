import { useEffect } from 'react';

// Basic accessible modal: closes on Escape or backdrop click and stops the page behind from scrolling.
export default function Modal({ title, onClose, children, locked = false }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && !locked) onClose();
    };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, locked]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !locked && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" aria-label="Close dialog" onClick={onClose} disabled={locked}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
