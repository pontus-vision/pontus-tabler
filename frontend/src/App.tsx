import { useContext, useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminView from './views/AdminView';
import DashboardView from './views/DashboardView';
import Login from './views/Login';
import { AuthContext, AuthProvider } from './AuthContext';
import ProtectedLayout from './ProtectedLayout';
import Unauthorized from './views/Unauthorized';
import UpdateTable from './views/tables/UpdateTable';
import DeleteTableView from './views/DeleteTableView';
import TablesReadView from './views/tables/ReadTables';
import Dashboards from './views/dashboards/Dashboards';
import CreateUser from './views/users/CreateUser';
import ReadUsers from './views/users/ReadUsers';
import UpdateUser from './views/users/UpdateUser';
import ReadAuthGroups from './views/authGroups/ReadAuthGroups';
import CreateAuthGroup from './views/authGroups/CreateAuthGroup';
import UpdateAuthGroup from './views/authGroups/UpdateAuthGroup';
import DashboardAuthGroup from './views/dashboard/DashboardAuthGroup';
import CreateDashboard from './views/dashboard/CreateDashboard';
import UpdateDashboard from './views/dashboard/UpdateDashboard';
import CreateTableView from './views/tables/CreateTable';
import TableDataReadView from './views/tables/table-data/TableDataRead';
import EdgesView from './views/EdgesView';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthGroupsView from './views/AuthGroupsView';
import AuthUsersView from './views/AuthUsersView';
import RegisterView from './views/Register';

function App() {
  const [count, setCount] = useState(0);

  const { isAuthenticated, userGroups: userRole } = useContext(AuthContext);

  const [dashboardId, setDashboardId] = useState<string>();

  const [openedSidebar, setOpenedSidebar] = useState(false);

  return (
    <AuthProvider>
      {
        <Header
          setOpenedSidebar={setOpenedSidebar}
          openedSidebar={openedSidebar}
        />
      }
      {
        <Sidebar
          setOpenedSidebar={setOpenedSidebar}
          openedSidebar={openedSidebar}
        />
      }
      <div className="main-view">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Navigate
                to={
                  localStorage.getItem('userRole')
                    ? '/dashboards/read'
                    : '/login'
                }
              />
            }
          />
          <Route path="/auth/users" element={<AuthUsersView />} />
          <Route path="/table/edges" element={<EdgesView />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route element={<ProtectedLayout allowedRoles={['User', 'Admin']} />}>
            <Route path="/dashboard" element={<DashboardView />} />
          </Route>
          <Route element={<ProtectedLayout allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminView />} />
            <Route path="/tables/read" element={<TablesReadView />} />
            <Route
              path="/table/data/read/:id"
              element={<TableDataReadView />}
            />
            <Route path="/dashboard/:id" element={<DashboardView />} />
            <Route path="/auth/groups" element={<AuthGroupsView />} />
            <Route path="/users/read" element={<ReadUsers />} />
            <Route path="/user/create" element={<CreateUser />} />

            <Route path="/user/update/:id" element={<UpdateUser />} />
          </Route>
          <Route path="/register" element={<RegisterView />} />
          <Route
            path="/register/admin"
            element={<RegisterView adminRoute={true} />}
          />
          <Route element={<ProtectedLayout allowedRoles={['Admin', 'User']} />}>
            <Route path="/table/update/:id" element={<UpdateTable />} />
            <Route path="/table/read/:id" element={<UpdateTable />} />
            <Route path="/table/create" element={<CreateTableView />} />
            <Route path="/table/delete" element={<DeleteTableView />} />
            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/dashboard/create" element={<CreateDashboard />} />
            <Route path="/dashboard/update/:id" element={<UpdateDashboard />} />
            <Route
              path="/table/data/read/:id"
              element={<TableDataReadView />}
            />
            <Route path="/auth/groups/read" element={<ReadAuthGroups />} />
            <Route path="/auth/group/create" element={<CreateAuthGroup />} />
            <Route
              path="/auth/group/update/:id"
              element={<UpdateAuthGroup />}
            />
            <Route
              path="dashboard/auth/group"
              element={<DashboardAuthGroup />}
            />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
