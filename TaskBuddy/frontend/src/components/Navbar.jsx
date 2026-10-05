import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Logo from './Logo.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Logo />
        <div className="navbar-right">
          <span className="navbar-welcome">Welcome, {user?.name}</span>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
