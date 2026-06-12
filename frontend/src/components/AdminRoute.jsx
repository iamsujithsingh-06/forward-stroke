import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

const ADMIN_EMAIL = 'sujithsinghsm6@gmail.com';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loading fullPage text="Verifying access..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin' || user?.email !== ADMIN_EMAIL) return <Navigate to="/access-denied" replace />;

  return children;
}
