import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

type Props = {
  allowedRoles: string[];
};

const ProtectedLayout = ({ allowedRoles }: Props) => {
  const { isAuthenticated } = useAuth();
  const [openedSidebar, setOpenedSidebar] = useState(false);

  const [userRole, setUserRole] = useState(() => {
    const storedAuth = localStorage.getItem('userRole');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  useEffect(() => {
    console.log({ userRole: allowedRoles?.includes(userRole) });
  }, [userRole]);

  return allowedRoles?.includes(userRole) ? (
    <>
      <Header
        setOpenedSidebar={setOpenedSidebar}
        openedSidebar={openedSidebar}
      />
      <Sidebar
        setOpenedSidebar={setOpenedSidebar}
        openedSidebar={openedSidebar}
      />
      <Outlet />
    </>
  ) : userRole ? (
    <Navigate to="/unauthorized" />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedLayout;
