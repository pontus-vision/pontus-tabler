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

function App() {
  const [count, setCount] = useState(0);

  const {} = useContext(AuthContext);

  const [dashboardId, setDashboardId] = useState<string>();

  return (
    <AuthProvider>
      <>
        <Routes>
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route element={<ProtectedLayout allowedRoles={['User', 'Admin']} />}>
            <Route path="/dashboard" element={<DashboardView />} />
          </Route>
          <Route element={<ProtectedLayout allowedRoles={['Admin', 'User']} />}>
            <Route path="/admin" element={<AdminView />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;
