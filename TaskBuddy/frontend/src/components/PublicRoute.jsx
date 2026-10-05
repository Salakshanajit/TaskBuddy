import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import LoadingSpinner from './LoadingSpinner.jsx';

// Login / register pages: logged-in users are sent straight to the dashboard.
export default function PublicRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) return <LoadingSpinner fullPage label="Checking your session…" />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
