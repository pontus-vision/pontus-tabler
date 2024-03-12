import { InternalServerError } from 'express-openapi-validator/dist/openapi.validator';
import {
  BadRequestError,
  ConflictEntityError,
  NotFoundError,
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
  upsertTableData,
} from './service/TableDataService';
import {
  createDashboardAuthGroup,
  deleteDashboard,
  readDashboardById,
  readDashboardGroupAuth,
  readDashboards,
  upsertDashboard,
  upsertDashboardGroupAuth,
  deleteDashboardGroupAuth,
} from './service/DashboardService';
import {
  createTableDataEdge,
  createTableEdge,
  deleteTableEdge,
  readTableDataEdge,
  readTableEdgesByTableId,
  // updateTableEdge,
} from './service/EdgeService';

export default new PontusService({
  authGroupCreatePost(req, res) {},
  authGroupDeletePost(req, res) {},
  authGroupReadPost(req, res) {},
  authGroupsReadPost(req, res) {},
  authGroupUpdatePost(req, res) {},
  authUserCreatePost(req, res) {},
  authUserDeletePost(req, res) {},
  authUserReadPost(req, res) {},
  authUsersReadPost(req, res) {},
  authUserUpdatePost(req, res) {},
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
    const response = await upsertDashboardGroupAuth(req.body);

    res.send(response);
  },
  dashboardCreatePost: async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      throw new BadRequestError(
        'Please, send dashboard properties in the body.',
      );
    }
    const response = await upsertDashboard(req.body);

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
    console.log({ response });
    res.send(response);
  },
  dashboardUpdatePost: async (req, res) => {
    const response = await upsertDashboard(req.body);

    res.send(response);
  },
  menuCreatePost: async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      throw new BadRequestError('Please, insert request body');
    }
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
      console.log({ response });
      if (response.statusCode === 404) {
        throw new NotFoundError('Not found');
      }
      console.log({ statusCode: response.statusCode });
      res.send({ ...response.resource, path: response.resource?.path || '' });
    } catch (error) {
      if (error?.code === 400) {
        throw new BadRequestError(error?.message);
      } else if (error?.code === 404) {
        throw new NotFoundError('Menu item not found.');
      }

      console.error({ catch: error });

      throw new InternalServerError(error);
    }
  },
  tableCreatePost: async (req, res) => {
    try {
      const response = await createTable(req.body);
      res.send(response);
    } catch (error) {
      if (error?.code === 409) {
        throw new ConflictEntityError('Table already declared');
      }
    }
  },
  tableReadPost: async (req, res) => {
    const response = await readTableById(req.body);

    res.send(response);
  },
  tableUpdatePost: async (req, res) => {
    const response = await updateTable(req.body);

    res.send(response);
  },
  tableDeletePost: async (req, res) => {
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
      const response = await upsertTableData(req.body);

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
      console.log({ req });
      const response = await createTableDataEdge(req.body);

      res.send(response);
    } catch (error) {
      console.log({ error });
    }
  },
  tableDataEdgeReadPost: async (req, res) => {
    const response = await readTableDataEdge(req.body);
    console.log({ response: JSON.stringify(response) });
    res.send(response);
  },
  tableDataEdgeDeletePost(req, res) {},
});
