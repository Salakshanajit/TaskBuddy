import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import LoadingSpinner from './LoadingSpinner.jsx';

// Only renders its children for logged-in users; everyone else is sent to the login page.
export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <LoadingSpinner fullPage label="Checking your session…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
