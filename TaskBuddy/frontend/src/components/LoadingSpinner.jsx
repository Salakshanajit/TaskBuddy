export default function LoadingSpinner({ label = 'Loading…', fullPage = false }) {
  return (
    <div className={`spinner-wrap ${fullPage ? 'spinner-full' : ''}`} role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
