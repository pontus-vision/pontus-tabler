import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedLayout from './ProtectedLayout';
import AdminView from './views/AdminView';
import DashboardView from './views/DashboardView';
import DeleteTableView from './views/DeleteTableView';
import TableDataReadView from './views/tables/table-data/TableDataRead';
import Unauthorized from './views/Unauthorized';
import CreateAuthGroup from './views/authGroups/CreateAuthGroup';
import ReadAuthGroups from './views/authGroups/ReadAuthGroups';
import UpdateAuthGroup from './views/authGroups/UpdateAuthGroup';
import CreateDashboard from './views/dashboard/CreateDashboard';
import DashboardAuthGroup from './views/dashboard/DashboardAuthGroup';
import UpdateDashboard from './views/dashboard/UpdateDashboard';
import Dashboards from './views/dashboards/Dashboards';
import CreateTableView from './views/tables/CreateTable';
import TablesReadView from './views/tables/ReadTables';
import UpdateTable from './views/tables/UpdateTable';
import CreateUser from './views/users/CreateUser';
import ReadUsers from './views/users/ReadUsers';
import UpdateUser from './views/users/UpdateUser';

const AppRoutes = () => {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={
                localStorage.getItem('userRole') ? '/dashboards/read' : '/login'
              }
            />
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<ProtectedLayout allowedRoles={['User', 'Admin']} />}>
          <Route path="/dashboard" element={<DashboardView />} />
        </Route>
        {/* <Route element={<ProtectedLayout allowedRoles={['Admin']} />}> */}
        <Route path="/admin" element={<AdminView />} />
        <Route path="/tables/read" element={<TablesReadView />} />
        <Route path="/table/data/read/:id" element={<TableDataReadView />} />
        <Route path="/dashboard/:id" element={<DashboardView />} />
        <Route path="/users/read" element={<ReadUsers />} />
        <Route path="/user/create" element={<CreateUser />} />

        <Route path="/user/update/:id" element={<UpdateUser />} />
        {/* </Route> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route element={<ProtectedLayout allowedRoles={['Admin', 'User']} />}> */}
        <Route path="/table/update/:id" element={<UpdateTable />} />
        <Route path="/table/read/:id" element={<UpdateTable />} />
        <Route path="/table/create" element={<CreateTableView />} />
        <Route path="/table/delete" element={<DeleteTableView />} />
        <Route path="/dashboards/read" element={<Dashboards />} />
        <Route path="/dashboard/create" element={<CreateDashboard />} />
        <Route path="/dashboard/update/:id" element={<UpdateDashboard />} />
        <Route path="/auth/groups/read" element={<ReadAuthGroups />} />
        <Route path="/auth/group/create" element={<CreateAuthGroup />} />
        <Route path="/auth/group/update/:id" element={<UpdateAuthGroup />} />
        <Route path="dashboard/auth/group" element={<DashboardAuthGroup />} />
        {/* </Route> */}
      </Routes>
      <div data-testid="location-display">{location.pathname}</div>
    </>
  );
};

export const routesConfig = [
  {
    path: '/',
    element: localStorage.getItem('userRole') ? '/dashboards/read' : '/login',
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    element: <ProtectedLayout allowedRoles={['User', 'Admin']} />,
    children: [{ path: '/dashboard', element: <DashboardView /> }],
  },
  {
    path: '/admin',
    element: <AdminView />,
  },
  {
    path: '/tables/read',
    element: <TablesReadView />,
  },
  {
    path: '/table/data/read/:id',
    element: <TableDataReadView />,
  },
  {
    path: '/dashboard/:id',
    element: <DashboardView />,
  },
  {
    path: '/users/read',
    element: <ReadUsers />,
  },
  {
    path: '/user/create',
    element: <CreateUser />,
  },
  {
    path: '/user/update/:id',
    element: <UpdateUser />,
  },
  {
    path: '/table/update/:id',
    element: <UpdateTable />,
  },
  {
    path: '/table/read/:id',
    element: <UpdateTable />,
  },
  {
    path: '/table/create',
    element: <CreateTableView />,
  },
  {
    path: '/table/delete',
    element: <DeleteTableView />,
  },
  {
    path: '/dashboards/read',
    element: <Dashboards />,
  },
  {
    path: '/dashboard/create',
    element: <CreateDashboard />,
  },
  {
    path: '/dashboard/update/:id',
    element: <UpdateDashboard />,
  },
  {
    path: '/table/data/read/:id',
    element: <TableDataReadView />,
  },
  {
    path: '/auth/groups/read',
    element: <ReadAuthGroups />,
  },
  {
    path: '/auth/group/create',
    element: <CreateAuthGroup />,
  },
  {
    path: '/auth/group/update/:id',
    element: <UpdateAuthGroup />,
  },
  {
    path: 'dashboard/auth/group',
    element: <DashboardAuthGroup />,
  },
];

export default AppRoutes;
