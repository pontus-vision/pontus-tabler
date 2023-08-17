import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const HomeLayout = () => {
  const { userRole, isAuthenticated } = useAuth();

  if (userRole || isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Outlet />
    </div>
  );
};
