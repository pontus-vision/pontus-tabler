import { useContext, useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import AdminView from './views/AdminView';
import Form from './components/Form';
import DashboardView from './views/DashboardView';
import NewEntryView from './views/NewEntryView';
import Login from './views/Login';
import { AuthContext, AuthProvider } from './AuthContext';
import ProtectedLayout from './ProtectedLayout';
import PrivateRoute from './PrivateRoutes';
import Unauthorized from './views/Unauthorized';
import CreateNewTable from './views/CreateNewTable';
import UpdateTable from './views/UpdateTable';
import DeleteTableView from './views/DeleteTableView';
import TablesReadView from './views/tables/read';
import Dashboards from './views/dashboards/Dashboards';
import CreateUser from './views/users/CreateUser';
import ReadUsers from './views/users/ReadUsers';

function App() {
  const [count, setCount] = useState(0);

  const {} = useContext(AuthContext);

  const [dashboardId, setDashboardId] = useState<string>();

  return (
    <AuthProvider>
      <>
        <Routes>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route element={<ProtectedLayout allowedRoles={['User', 'Admin']} />}>
            <Route path="/dashboard" element={<DashboardView />} />
          </Route>
          <Route element={<ProtectedLayout allowedRoles={['Admin', 'User']} />}>
            <Route path="/admin" element={<AdminView />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout allowedRoles={['Admin', 'User']} />}>
            <Route path="/table/create" element={<CreateNewTable />} />
            <Route path="/table/update" element={<UpdateTable />} />
            <Route path="/table/delete" element={<DeleteTableView />} />
            <Route path="/tables/read" element={<TablesReadView />} />
            <Route path="/dashboards/read" element={<Dashboards />} />
            <Route path="/dashboard/:id" element={<DashboardView />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/users/read" element={<ReadUsers />} />
          </Route>
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;
