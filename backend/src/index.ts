import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from './generated/api';
import { PontusService, PontusServiceMethods } from './generated/api/resources/pontus/service/PontusService';
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
  // authUserGroupsUpdate,
  authUserRead,
  authUserUpdate,
  authUsersRead,
  loginUser,
  logout,
  registerAdmin,
  registerUser,
  setup,
} from './service/AuthUserService';
import { createWebhook } from './service/WebhookService';
import { isJSONStringable, runQuery } from './db-utils';
import { AUDIT, AUTH_GROUPS, GROUPS_USERS, schema, schemaSql } from './consts';
import { getJwtClaims } from './service/delta';



const handlers: PontusServiceMethods = {
  createJobPost: async (req, res) => {

  },
  readJobPost: async (req, res) => {

  },
  sendWebhookPost: async (req, res) => {
    const response = await createWebhook(req.body)

    res.send(response)
  },
  registerUserPost: async (req, res) => {
    const response = await registerUser(req.body);

    res.send(response);
  },
  registerAdminPost: async (req, res) => {
    const response = await registerAdmin(req.body);

    res.send(response);
  },
  loginPost: async (req, res) => {
    const response = await loginUser(req.body);

    const token = response.accessToken

    const jwt = getJwtClaims(token)

    const userId = jwt['userId']

    const groupIds = await runQuery(`SELECT g.name FROM ${schemaSql}${GROUPS_USERS} gu JOIN ${schemaSql}${AUTH_GROUPS} g ON g.id=gu.table_from__id WHERE gu.table_to__id = ?`, [userId])

    await runQuery(`INSERT INTO ${schemaSql}${AUDIT} (session_id, api_path, body, error, user_id, group_ids, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [token, req.path, req.body, null, userId, JSON.stringify(groupIds.map(group => group['name'])), new Date().toISOString().replace("Z", "")])

    res.send(response);
  },
  logoutPost: async (req, res) => {
    await setup();
    const response = await logout(req.body);

    res.send(response);
  },
  tokenPost: async (req, res) => {
    // const response = await refreshToken(req.body);

    // res.send(response);
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
    // const response = await authUserGroupsUpdate(req.body);

    // res.send(response);
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
    const username = req['user']['username']
    if (Object.keys(req.body).length === 0) {
      throw new BadRequestError('Body is empty.')
    }

    const response = await createDashboard({ ...req.body, owner: username });

    res.send(response);
  },
  dashboardDeletePost: async (req, res) => {

    const response = await deleteDashboard(req.body);

    res.send(response);
  },
  dashboardReadPost: async (req, res) => {
    const userId = req['user']['userId']
    const response = await readDashboardById(req.body.id, userId);

    res.send(response);
  },
  dashboardsReadPost: async (req, res) => {
    const userId = req['user']['userId']
    const response = await readDashboards(req.body, userId);

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
    const response = await deleteMenuItem(req.body);


    res.send(response);
  },
  menuReadPost: async (req, res) => {

    if (req.body === undefined) {
      throw new BadRequestError('Please, insert request body');
    }
    const response = (await readMenuItemByPath(req.body.path)) as any;

    res.send(response);
  },
  menuUpdatePost: async (req, res) => {
    const response = await updateMenuItem(req.body);

    res.send(response)
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
  authGroupTableCreatePost: async (req, res) => { },
  authGroupTableDeletePost(req, res) { },
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
      throw new ForbiddenError(
        'This user does not have any groups with such authorization',
      );
    }
    const response = await createTable(req.body);
    res.send(response);
  },
  tableReadPost: async (req, res) => {
    const perms = await checkTableMetadataPermissions(req['user']['userId']);

    if (!perms.read) {
      throw new ForbiddenError(
        'This user does not have any groups with such authorization',
      );
    }
    const response = await readTableById(req.body);

    res.send(response);
  },
  tableUpdatePost: async (req, res) => {
    const perms = await checkTableMetadataPermissions(req['user']['userId']);

    if (!perms.update) {
      throw new ForbiddenError(
        'This user does not have any groups with such authorization',
      );
    }

    const response = await updateTable(req.body);

    res.send(response);
  },
  tableDeletePost: async (req, res) => {
    const perms = await checkTableMetadataPermissions(req['user']['userId']);

    if (!perms.delete) {
      throw new ForbiddenError(
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
    const response = await deleteTableData(req.body);

    res.send(response);

  },
  tableDataReadPost: async (req, res) => {
    const response = await readTableData(req.body);

    res.send(response);
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
    // const response = await deleteTableEdge(req.body);

    // res.send(response);
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
    } catch (error) { }
  },
  tableDataEdgeReadPost: async (req, res) => {
    const response = await readTableDataEdge(req.body);

    res.send(response);
  },
  tableDataEdgeDeletePost(req, res) { },
}

export function withErrorHandler(handler) {
  return async (req, res, next) => {
    if (req?.['authError']?.['code'] === 401) {
      throw new UnauthorizedError(req?.['authError']?.['message'])
    } else if (req?.['authError']?.['code'] === 400) {
      throw new BadRequestError(req?.['authError']?.['message'])
    }
    try {
      await handler(req, res);
    } catch (err) {
      console.error(`[${req.method} ${req.path}] Error:`, err);

      const token = req.headers['authorization']
      const userId = req?.['user']?.['userId'] || null;
      const groupIds = JSON.stringify(req?.['user']?.['groupIds']) || '';
      const body = isJSONStringable(req.body) ? JSON.stringify(req.body) : null;

      const error = {
        code: err['errorName'] === 'NotFoundError' ? 404 :
          err['errorName'] === 'UnauthorizedError' ? 401 :
            err['errorName'] === 'ForbiddenError' ? 403 :
              err['errorName'] === 'BadRequestError' ? 400 :
                err['errorName'] === 'ConflictEntityError' ? 409 :
                  err['errorName'] === 'TemporaryRedirect' ? 307 : 500,
        message: err['msg']
      }

      await runQuery(
        `INSERT INTO ${schemaSql}${AUDIT} (session_id, api_path, body, error, user_id, group_ids, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [token, req.path, body, JSON.stringify(error), userId, groupIds, new Date().toISOString().replace("Z", "")]
      );

      if (typeof res.status === 'function') {
        const status = err?.code || 500;
        // res.status(status).json({ error: err.msg || 'Internal Server Error' });
      }
      throw err
    }
  };
}

function wrapHandlersWithErrorHandling(handlersObj: PontusServiceMethods): PontusServiceMethods {
  const wrapped = {} as PontusServiceMethods;

  for (const key in handlersObj) {
    const handler = handlersObj[key];
    wrapped[key] = typeof handler === 'function'
      ? withErrorHandler(handler)
      : handler;
  }

  return wrapped;
}

export default new PontusService(wrapHandlersWithErrorHandling(handlers));
