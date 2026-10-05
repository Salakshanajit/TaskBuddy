export default function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill={light ? '#ffffff' : '#0e7c86'} />
        <path d="M9 16.5l4.5 4.5L23 11.5" fill="none" stroke={light ? '#0e7c86' : '#ffffff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>TaskBuddy</span>
    </span>
  );
}
