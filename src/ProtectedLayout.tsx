import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';

const ProtectedLayout = ({ allowedRoles }) => {
  const { userRole, isAuthenticated } = useAuth();
  const [openedSidebar, setOpenedSidebar] = useState(false);

  useEffect(() => {
    console.log({ userRole: allowedRoles?.includes(userRole) });
  }, [userRole]);

  return allowedRoles?.includes(userRole) ? (
    <div>
      <>
        <Header
          setOpenedSidebar={setOpenedSidebar}
          openedSidebar={openedSidebar}
        />
        <Sidebar
          setOpenedSidebar={setOpenedSidebar}
          openedSidebar={openedSidebar}
        />
      </>
      <Outlet />
    </div>
  ) : userRole ? (
    <Navigate to="/unauthorized" />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedLayout;
