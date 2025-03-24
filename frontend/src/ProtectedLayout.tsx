import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useState } from 'react';

type Props = {
  allowedRoles: string[];
};

const ProtectedLayout = ({ allowedRoles }: Props) => {
  const { isAuthenticated, userGroups } = useAuth();

  const [userRole, setUserRole] = useState(() => {
    const storedAuth = localStorage.getItem('userGroupId');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  return allowedRoles?.some((el) =>
    userGroups.some((el2) => el2.name === el),
  ) ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default ProtectedLayout;
