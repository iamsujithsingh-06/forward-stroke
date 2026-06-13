import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

export default function CustomerRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading fullPage text="Verifying access..." />;

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}