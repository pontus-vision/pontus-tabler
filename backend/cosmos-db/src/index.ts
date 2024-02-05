import { InternalServerError } from 'express-openapi-validator/dist/openapi.validator';
import {
  BadRequestError,
  MenuItemNotFoundError,
  NotFoundError,
} from './generated/api';
import { PontusService } from './generated/api/resources/pontus/service/PontusService';
// import { MenuItemNotFoundError } from './generated/serialization';

import {
  createMenuItem,
  deleteMenuItem,
  readMenuItemByPath,
  updateMenuItem,
} from './service/MenuService';
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
  dashboardCreatePost(req, res) {},
  dashboardDeletePost(req, res) {},
  dashboardGroupAuthCreatePost(req, res) {},
  dashboardGroupAuthDeletePost(req, res) {},
  dashboardGroupAuthReadPost(req, res) {},
  dashboardGroupAuthUpdatePost(req, res) {},
  dashboardReadPost(req, res) {},
  dashboardsReadPost(req, res) {},
  dashboardUpdatePost(req, res) {},
  menuCreatePost: async (req, res) => {
    console.log({
      res: Object.keys(req.body).length,
    });
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
        throw new MenuItemNotFoundError(error?.message);
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
      }

      console.error({ catch: error });

      throw new InternalServerError(error);
    }
  },
  tableCreatePost(req, res) {},
  tableDataCreatePost(req, res) {},
  tableDataDeletePost(req, res) {},
  tableDataReadPost(req, res) {},
  tableDataUpdatePost(req, res) {},
  tableDeletePost(req, res) {},
  tableReadPost(req, res) {},
  tablesReadPost(req, res) {},
  tableUpdatePost(req, res) {},
});
