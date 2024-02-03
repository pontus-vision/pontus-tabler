import { PontusService } from './generated/api/resources/pontus/service/PontusService';
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
    const response = await createMenuItem(req.body);

    res.send(response);
  },
  menuDeletePost: async (req, res) => {
    const response = await deleteMenuItem(req.body);
  },
  menuReadPost: async (req, res) => {
    const response = await readMenuItemByPath(req.body.path);

    res.send(response);
  },
  menuUpdatePost: async (req, res) => {
    const response = await updateMenuItem(req.body);

    res.send(response);
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
