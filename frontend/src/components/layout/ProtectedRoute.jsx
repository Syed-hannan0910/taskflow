import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-slate-400 text-sm">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}