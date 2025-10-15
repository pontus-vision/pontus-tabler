import { useContext, useEffect, useRef, useState } from 'react';
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
import RegisterUser from './views/users/RegisterUser'
import NotificationManager, { MessageRefs } from './components/NotificationManager';
import SettingsView from './views/SettingsView';
import { useTranslation } from 'react-i18next';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const [count, setCount] = useState(0);

  const { isAuthenticated, userGroups: userRole } = useContext(AuthContext);

  const [dashboardId, setDashboardId] = useState<string>();

  const [openedSidebar, setOpenedSidebar] = useState(false);

  const { i18n, t } = useTranslation();

  useEffect(() => {
    const language = localStorage.getItem('language')
    i18n.changeLanguage(language)
  }, [])

  const notificationManagerRef = useRef<MessageRefs>(null);

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
        <NotificationManager ref={notificationManagerRef} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/users" element={<AuthUsersView />} />
          <Route path="/table/edges" element={<EdgesView />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/tables/read" element={<TablesReadView notificationManagerRef={notificationManagerRef} />} />
          <Route
            path="/table/data/read/:id"
            element={<TableDataReadView />}
          />
          <Route path="/dashboard/:id" element={<DashboardView />} />
          <Route path="/auth/groups" element={<AuthGroupsView />} />
          <Route path="/users/read" element={<ReadUsers />} />
          <Route path="/user/create" element={<CreateUser />} />

          <Route path="/user/update/:id" element={<UpdateUser />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/register/user" element={<RegisterUser notificationManagerRef={notificationManagerRef} />} />
          <Route
            path="/register/admin"
            element={<RegisterView adminRoute={true} notificationManagerRef={notificationManagerRef} />}
          />
          {/*
            <Route element={<ProtectedLayout allowedRoles={['Admin', 'User']} />}>
          */}
          <Route path="/table/update/:id" element={<UpdateTable />} />
          <Route path="/table/read/:id" element={<UpdateTable />} />
          <Route path="/table/create" element={<CreateTableView />} />
          <Route path="/table/delete" element={<DeleteTableView />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/dashboard/create" element={<CreateDashboard />} />
          <Route path="/dashboard/create/:id" element={<CreateDashboard />} />
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
          {/*
          </Route>
          */}
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
