import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import useAuth from '../hooks/useAuth.js';

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="notfound">
      <Logo />
      <h1>404</h1>
      <p className="notfound-title">This page does not exist.</p>
      <p className="muted">The link may be broken or the page may have been moved.</p>
      <Link to={user ? '/dashboard' : '/login'} className="btn btn-primary">
        {user ? 'Back to dashboard' : 'Go to login'}
      </Link>
    </div>
  );
}
