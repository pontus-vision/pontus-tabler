import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { readUserGroups } from './client';
import { getJwtClaims } from '../utils';
import { Accordion } from 'semantic-ui-react';
import { ReadPaginationFilterFilters } from './typescript/api';

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
