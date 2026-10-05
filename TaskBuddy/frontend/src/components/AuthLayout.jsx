import Logo from './Logo.jsx';

// Shared two-column layout for the login and register pages.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <Logo light />
        <div>
          <h2>Know what is due, what is moving, and what is done.</h2>
          <p>
            Create tasks with a due date and priority, move them from pending to completed, and
            keep your week under control.
          </p>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-mobile-logo"><Logo /></div>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </main>
    </div>
  );
}
