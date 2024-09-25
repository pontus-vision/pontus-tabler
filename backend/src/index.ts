import { InternalServerError } from 'express-openapi-validator/dist/openapi.validator';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from './generated/api';
import { PontusService } from './generated/api/resources/pontus/service/PontusService';
import {
  createMenuItem,
  deleteMenuItem,
  readMenuItemByPath,
  updateMenuItem,
} from './service/MenuService';
import {
  createTable,
  deleteTable,
  readTableById,
  readTables,
  updateTable,
} from './service/TableService';
import {
  deleteTableData,
  readTableData,
  updateTableData,
  createTableData,
} from './service/TableDataService';
import {
  createDashboardAuthGroup,
  deleteDashboard,
  readDashboardById,
  readDashboardGroupAuth,
  readDashboards,
  createDashboard,
  updateDashboardGroupAuth,
  deleteDashboardGroupAuth,
  updateDashboard,
  DASHBOARDS,
} from './service/DashboardService';
import {
  createTableDataEdge,
  createTableEdge,
  deleteTableEdge,
  readTableDataEdge,
  readTableEdgesByTableId,
  // updateTableEdge,
} from './service/EdgeService';
import {
  createAuthGroup,
  createAuthGroupDashboards,
  deleteAuthGroup,
  deleteAuthGroupDashboards,
  readAuthGroup,
  readAuthGroupDashboards,
  updateAuthGroupDashboards,
  readAuthGroups,
  updateAuthGroup,
  createAuthUserGroup,
  readAuthGroupUsers,
  updateAuthGroupUsers,
  deleteAuthGroupUsers,
  createAuthGroupTables,
  deleteAuthGroupTables,
  readAuthGroupTables,
  checkPermissions,
  readAuthGroupTable,
  checkTableMetadataPermissions,
  updateAuthGroupTable,
} from './service/AuthGroupService';
import {
  authUserCreate,
  authUserDelete,
  authUserGroupsCreate,
  authUserGroupsDelete,
  authUserGroupsRead,
  authUserGroupsUpdate,
  authUserRead,
  authUserUpdate,
  authUsersRead,
  loginUser,
  logout,
  registerAdmin,
  registerUser,
  setup,
} from './service/AuthUserService';
import { Request } from 'express';
import { refreshToken } from './service/cosmosdb/AuthUserService';
import { authenticateToken, checkAdmin } from './service/AuthUserService';

export default new PontusService({
  registerUserPost: async (req, res) => {
    // await setup();

    const response = await registerUser(req.body);
    res.send(response);
  },
  registerAdminPost: async (req, res) => {
    const response = await registerAdmin(req.body);
    res.send(response);
  },
  loginPost: async (req, res) => {
    // await setup();
    const response = await loginUser(req.body);

    res.send(response);
  },
  logoutPost: async (req, res) => {
    await setup();
    const response = await logout(req.body);

    res.send(response);
  },
  tokenPost: async (req, res) => {
    const response = await refreshToken(req.body);

    res.send(response);
  },
  authGroupCreatePost: async (req, res) => {
    const response = await createAuthGroup(req.body);

    res.send(response);
  },
  authGroupDeletePost: async (req, res) => {
    const response = await deleteAuthGroup(req.body);

    res.send(response);
  },
  authGroupReadPost: async (req, res) => {
    const response = await readAuthGroup(req.body);

    res.send(response);
  },
  authGroupsReadPost: async (req, res) => {
    const response = await readAuthGroups(req.body);

    res.send(response);
  },
  authGroupUpdatePost: async (req, res) => {
    const response = await updateAuthGroup(req.body);

    res.send(response);
  },
  authUserCreatePost: async (req, res) => {
    // await setup();

    const response = await authUserCreate(req.body);

    res.send(response);
  },
  authUserDeletePost: async (req, res) => {
    const response = await authUserDelete(req.body);

    res.send(response);
  },
  authUserReadPost: async (req, res) => {
    const response = await authUserRead(req.body);
    const auth = res.send(response);
  },
  authUsersReadPost: async (req, res) => {
    const response = await authUsersRead(req.body);

    res.send(response);
  },
  authUserUpdatePost: async (req, res) => {
    const response = await authUserUpdate(req.body);

    res.send(response);
  },
  authUserGroupsCreatePost: async (req, res) => {
    const response = await authUserGroupsCreate(req.body);

    res.send(response);
  },
  authUserGroupsDeletePost: async (req, res) => {
    const response = await authUserGroupsDelete(req.body);

    res.send(response);
  },
  authUserGroupsReadPost: async (req, res) => {
    const response = await authUserGroupsRead(req.body);

    res.send(response);
  },
  authUserGroupsUpdatePost: async (req, res) => {
    const response = await authUserGroupsUpdate(req.body);

    res.send(response);
  },
  dashboardGroupAuthCreatePost: async (req, res) => {
    const response = await createDashboardAuthGroup(req.body);

    res.send(response);
  },
  dashboardGroupAuthDeletePost: async (req, res) => {
    const response = await deleteDashboardGroupAuth(req.body);

    res.send(response);
  },
  dashboardGroupAuthReadPost: async (req, res) => {
    const response = await readDashboardGroupAuth(req.body);

    res.send(response);
  },
  dashboardGroupAuthUpdatePost: async (req, res) => {
    const response = await updateDashboardGroupAuth(req.body);

    res.send(response);
  },
  authGroupDashboardCreatePost: async (req, res) => {
    const response = await createAuthGroupDashboards(req.body);

    res.send(response);
  },
  authGroupDashboardDeletePost: async (req, res) => {
    const response = await deleteAuthGroupDashboards(req.body);

    res.send(response);
  },
  authGroupDashboardsReadPost: async (req, res) => {
    const response = await readAuthGroupDashboards(req.body);

    res.send(response);
  },
  authGroupDashboardUpdatePost: async (req, res) => {
    const response = await updateAuthGroupDashboards(req.body);

    res.send(response);
  },
  authGroupUsersCreatePost: async (req, res) => {
    const response = await createAuthUserGroup(req.body);

    res.send(response);
  },
  authGroupUsersDeletePost: async (req, res) => {
    const response = await deleteAuthGroupUsers(req.body);

    res.send(response);
  },
  authGroupUsersReadPost: async (req, res) => {
    const response = await readAuthGroupUsers(req.body);

    res.send(response);
  },
  authGroupUsersUpdatePost: async (req, res) => {
    const response = await updateAuthGroupUsers(req.body);

    res.send(response);
  },
  dashboardCreatePost: async (req, res) => {
    if(Object.keys(req.body).length === 0) {
      throw new BadRequestError('Body is empty.')
    }

    const response = await createDashboard(req.body);

    res.send(response);
  },
  dashboardDeletePost: async (req, res) => {
 
    const response = await deleteDashboard(req.body);

    res.send(response);
  },
  dashboardReadPost: async (req, res) => {
   
    const response = await readDashboardById(req.body.id);

    res.send(response);
  },
  dashboardsReadPost: async (req, res) => {
    const response = await readDashboards(req.body);

    res.send(response);
  },
  dashboardUpdatePost: async (req, res) => {
    const response = await updateDashboard(req.body);
    res.send(response);
  },
  menuCreatePost: async (req, res) => {
    const response = await createMenuItem(req.body);

    res.send(response);
  },
  menuDeletePost: async (req, res) => {
    try {
      const response = await deleteMenuItem(req.body);
      res.send(response);
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError('Menu item not found');
      }
    }
  },
  menuReadPost: async (req, res) => {
    try {
      if (req.body === undefined) {
        throw new BadRequestError('Please, insert request body');
      }
      const response = (await readMenuItemByPath(req.body.path)) as any;

      res.send(response);
    } catch (error) {
      if (error?.code === 404) {
        console.error({ error });
        throw new NotFoundError(error?.message);
      }
    }
  },
  menuUpdatePost: async (req, res) => {
    try {
      const response = await updateMenuItem(req.body);

      if (response.statusCode === 404) {
        throw new NotFoundError('Not found');
      }

      res.send({ ...response.resource, path: response.resource?.path || '' });
    } catch (error) {
      if (error?.code === 400) {
        throw new BadRequestError(error?.message);
      } else if (error?.code === 404) {
        throw new NotFoundError('Menu item not found.');
      }

      throw new InternalServerError(error);
    }
  },
  authGroupsTablesCreatePost: async (req, res) => {
    const response = await createAuthGroupTables(req.body);

    res.send(response);
  },
  authGroupsTablesDeletePost: async (req, res) => {
    const response = await deleteAuthGroupTables(req.body);

    res.send(response);
  },
  authGroupsTablesReadPost: async (req, res) => {
    const response = await readAuthGroupTables(req.body);

    res.send(response);
  },
  authGroupTableCreatePost: async (req, res) => {},
  authGroupTableDeletePost(req, res) {},
  authGroupTablesReadPost: async (req, res) => {
    const response = await readAuthGroupTable(req.body);

    res.send(response);
  },
  authGroupTableUpdatePost: async (req, res) => {
    const response = await updateAuthGroupTable(req.body);

    res.send(response);
  },
  tableCreatePost: async (req, res) => {
    const perms = await checkTableMetadataPermissions(req['user']['userId']);

    if (!perms.create) {
      throw new UnauthorizedError(
        'This user does not have any groups with such authorization',
      );
    }
    const response = await createTable(req.body);
    res.send(response);
  },
  tableReadPost: async (req, res) => {
    const perms = await checkTableMetadataPermissions(req['userId']);

    if (!perms.read) {
      throw new UnauthorizedError(
        'This user does not have any groups with such authorization',
      );
    }
    const response = await readTableById(req.body);

    res.send(response);
  },
  tableUpdatePost: async (req, res) => {
    const perms = await checkTableMetadataPermissions(req['userId']);

    if (!perms.update) {
      throw new UnauthorizedError(
        'This user does not have any groups with such authorization',
      );
    }

    const response = await updateTable(req.body);

    res.send(response);
  },
  tableDeletePost: async (req, res) => {
    const perms = await checkTableMetadataPermissions(req['userId']);

    if (!perms.delete) {
      throw new UnauthorizedError(
        'This user does not have any groups with such authorization',
      );
    }

    try {
      const response = await deleteTable(req.body);
      res.send('Table deleted.');
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError('Table not found.');
      }
    }
  },
  tablesReadPost: async (req, res) => {
    try {
      const response = await readTables(req.body);

      res.send(response);
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError('Table not found.');
      }
    }
  },
  tableDataCreatePost: async (req, res) => {
    try {
      const response = await createTableData(req.body);

      res.send(response);
    } catch (error) {
      if (error?.code === 400) {
        throw new BadRequestError(error?.message);
      } else if (error?.code === 404) {
        throw new NotFoundError(error?.message);
      }
    }
  },
  tableDataDeletePost: async (req, res) => {
    try {
      const response = await deleteTableData(req.body);

      res.send(response);
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError(error?.message);
      }
    }
  },
  tableDataReadPost: async (req, res) => {
    try {
      const response = await readTableData(req.body);

      res.send(response);
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError(error?.message);
      }
    }
  },
  tableDataUpdatePost: async (req, res) => {
    try {
      const response = await updateTableData(req.body);

      res.send(response);
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError(error?.message);
      }
    }
  },
  tableEdgeCreatePost: async (req, res) => {
    const response = await createTableEdge(req.body);

    res.send(response);
  },
  tableEdgeDeletePost: async (req, res) => {
    const response = await deleteTableEdge(req.body);

    res.send(response);
  },
  tableEdgeReadPost: async (req, res) => {
    const response = await readTableEdgesByTableId(req.body);

    res.send(response);
  },
  tableEdgeUpdatePost: async (req, res) => {
    // const response = await updateTableEdge(req.body);
    // res.send(response);
  },
  tableDataEdgeCreatePost: async (req, res) => {
    try {
      const response = await createTableDataEdge(req.body);

      res.send(response);
    } catch (error) {}
  },
  tableDataEdgeReadPost: async (req, res) => {
    const response = await readTableDataEdge(req.body);

    res.send(response);
  },
  tableDataEdgeDeletePost(req, res) {},
});
