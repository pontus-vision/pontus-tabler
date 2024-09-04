import { prepareDbAndAuth, isSubset, post } from './test-utils';
import { deleteDatabase } from '../cosmos-utils';
import { app, srv } from '../server';
import { AxiosResponse } from 'axios';
import {
  MenuItemTreeRef,
  MenuCreateRes,
  MenuReadRes,
  MenuUpdateReq,
  MenuUpdateRes,
  MenuReadReq,
  MenuCreateReq,
  DashboardReadReq,
  DashboardReadRes,
  AuthUserCreateRes,
} from '../typescript/api';
import { DELTA_DB, GROUPS_USERS } from '../service/AuthGroupService';
import { GROUPS_DASHBOARDS } from '../service/EdgeService';
import {
  AUTH_GROUPS,
  AUTH_USERS,
  DASHBOARDS,
  TABLES,
  AUTH_GROUPS_USER_TABLE,
} from '../service/delta';

// // Mock the utils.writeJson function
// jest.mock('../utils/writer', () => ({
//   writeJson: jest.fn(),
// }));

// // Mock the Default service functions
// jest.mock('../service/DefaultService', () => ({
//   dashboardUpdatePOST: jest.fn(),
//   dashboardsReadPOST: jest.fn(),
// }));

jest.setTimeout(1000000);

describe('testing Menu', () => {
  const OLD_ENV = process.env;

  let admin = {} as AuthUserCreateRes;
  let postAdmin;
  beforeEach(async () => {
    let tables = [AUTH_GROUPS, AUTH_USERS, DASHBOARDS, TABLES];
    if (process.env.DB_SOURCE === DELTA_DB) {
      tables = [...tables, GROUPS_USERS, GROUPS_DASHBOARDS, 'person_natural'];
    }
    const dbUtils = await prepareDbAndAuth(tables);
    postAdmin = dbUtils.postAdmin;
    admin = dbUtils.admin;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    srv.close();
  });

  it('should read the root', async () => {
    const data: MenuReadReq = {
      path: '/',
    };
    const readRes = await post('menu/read', data);

    expect(readRes.status).toBe(200);
  });
  it('should create a folder under root', async () => {
    const data: MenuReadReq = {
      path: '/',
    };
    const readRes = await post('menu/read', data);

    const data2: MenuUpdateReq = {
      id: readRes.data?.id,
      path: readRes.data?.path,

      children: [{ kind: 'file', name: 'file1' }],
    };

    const createRes = await post('menu/create', data2);

    console.log({ updateRes: createRes });

    const readRes2 = await post('menu/read', {
      path: createRes.data?.children[0]?.path,
    });

    expect(readRes2.status).toBe(200);

    const readRes3 = await post('menu/read', {
      path: createRes.data?.path,
    });

    const obj1 = data2.children[0];

    const obj2 = readRes3.data.children[0];

    expect(isSubset(obj1, obj2)).toBe(true);
  });

  it('should do the CRUD "happy path"', async () => {
    // Create Menu Item

    const readMenuRoot = await post('menu/read', {
      path: '/',
    });

    const body: MenuItemTreeRef = {
      path: '/',
      id: readMenuRoot.data.id,
      children: [
        {
          name: 'string',
          kind: 'folder',
          children: [],
        },
      ],
    };

    const createRetVal = (await post(
      'menu/create',
      body,
    )) as AxiosResponse<MenuCreateRes>;

    let readRetVal: MenuCreateRes = createRetVal.data;

    expect(isSubset(body, readRetVal)).toBeTruthy();

    // Read the created Menu Item

    const readRetVal2 = (await post('menu/read', {
      path: readRetVal?.path,
    })) as AxiosResponse<MenuReadRes>;

    expect(isSubset(body, readRetVal2.data)).toBe(true);

    const readDashBody: DashboardReadReq = {
      id: readRetVal2.data.children[0].id,
    };

    const readDashVal = (await post(
      'dashboard/read',
      readDashBody,
    )) as AxiosResponse<DashboardReadRes>;

    expect(readDashVal.data.name).toBe(readRetVal2.data.children[0].name);

    const body2: MenuUpdateReq = {
      id: readRetVal.id,
      path: readRetVal.path,
      children: [
        {
          path: createRetVal.data.children[0].path,
          id: createRetVal.data.children[0].id,
          name: 'string2',
          kind: 'folder',
          children: [],
        },
      ],
    };

    // Checking if update is correct.

    const updateRetVal = await post('menu/update', body2);

    let resPayload3: MenuUpdateRes = updateRetVal.data;

    expect(
      updateRetVal.data.children.some((el) => el.path === '/string2'),
    ).toBe(true);

    // Deleting and checking if the file was indeed deleted.

    const body3 = {
      id: resPayload3.id,
      path: resPayload3.path,
    };

    const createFileBody: MenuItemTreeRef = {
      path: '/',
      id: readMenuRoot.data.id,
      children: [
        {
          name: 'foo',
          kind: 'file',
          children: [],
        },
      ],
    };

    const createFileRetVal = await post('menu/create', createFileBody);

    expect(createFileRetVal.status).toBe(200);

    const updateFileBody: MenuItemTreeRef = {
      id: readMenuRoot.data.id,
      path: readMenuRoot.data.path,
      kind: 'folder',
      children: [
        {
          path: '/foo',
          name: 'bar',
          kind: 'file',
          id: createFileRetVal.data.children.find((el) => el.name === 'foo').id,
        },
      ],
    };

    const updateFileRetVal = (await post(
      'menu/update',
      updateFileBody,
    )) as AxiosResponse<MenuUpdateReq>;

    expect(
      updateFileRetVal.data.children.some((el) => el.path === '/bar'),
    ).toBe(true);

    const deleteRetVal = await post('menu/delete', body3);

    expect(deleteRetVal.status).toBe(200);

    const readRetVal3 = await post('menu/read', { path: body3.path });

    expect(readRetVal3.status).toBe(404);
  });
  it('should do the CRUD "sad path"', async () => {
    const createRetVal = await post('menu/create', { path: '/foo', id: 'bar' });

    expect(createRetVal.status).toBe(404);

    const readRetVal = await post('menu/read', {
      id: 'foo',
      path: 'bar',
    });

    expect(readRetVal.status).toBe(422);

    const updateRetVal = await post('menu/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(422);

    const updateRetVal2 = await post('menu/update', {
      path: 'bar',
      id: 'foo',
      name: 'john',
    });

    expect(updateRetVal2.status).toBe(404);

    const updateRetVal3 = await post('menu/update', {
      path: 'bar',
      id: 'foo',
    });

    expect(updateRetVal3.status).toBe(400);

    const updateRetVal4 = await post('menu/update', {});

    expect(updateRetVal3.status).toBe(400);

    const deleteRetVal = await post('menu/delete', { foo: 'bar' });

    expect(deleteRetVal.status).toBe(422);

    const deleteRetVal2 = await post('menu/delete', { path: 'bar', id: 'foo' });

    expect(deleteRetVal2.status).toBe(404);
  });
});
