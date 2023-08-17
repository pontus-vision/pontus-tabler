import { useContext } from 'react';
import { useAuth } from './AuthContext';
import { Navigate, Route } from 'react-router-dom';

interface PrivateRouteProps {
  path?: string;
  roles: string[];
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  path,
  roles,
  element,
}) => {
  const { isAuthenticated, userRole } = useAuth();

  return isAuthenticated && roles.includes(userRole!) ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
