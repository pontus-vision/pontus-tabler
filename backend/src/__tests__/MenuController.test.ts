import { prepareDbAndAuth, isSubset, post } from './test-utils';
import { srv } from '../server';
import { AxiosResponse } from 'axios';
import {
  MenuItemTreeRef,
  MenuCreateRes,
  MenuCreateReq,
  MenuReadRes,
  MenuUpdateReq,
  MenuUpdateRes,
  MenuReadReq,
  DashboardReadReq,
  DashboardReadRes,
  AuthUserCreateRes,
} from '../typescript/api';
import { AUTH_GROUPS, AUTH_USERS, DASHBOARDS, DELTA_DB, GROUPS_DASHBOARDS, GROUPS_USERS, MENU, TABLES } from '../consts';


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
      tables = [...tables, GROUPS_USERS, GROUPS_DASHBOARDS, 'person_natural', MENU];
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
  it('should test algo', () => {

    const data: MenuItemTreeRef = {
      kind: 'folder',
      name: 'root',
      path: "/",
      children: []
    }

    const updateAndRetrieveTree = (path: string, obj: any, modifyCallback: (node) => void) => {
      if (path === obj.path) {
        modifyCallback(obj)
        return obj
      }

      for (const child of obj.children) {
        const result = updateAndRetrieveTree(path, child, modifyCallback)
        if (result) return obj
      }
    }

    const data2: MenuItemTreeRef = {
      kind: 'folder',
      name: 'foo',
      path: "/",
    }

    const res = updateAndRetrieveTree('/', data, (node) => { node.children.push(data2) })
    expect(res).toMatchObject(
      {
        kind: 'folder',
        name: 'root',
        path: "/",
        children: [{
          kind: 'folder',
          name: 'foo',
          path: "/",
        }]
      }
    )
  })

  it('should read the root', async () => {
    const data2: MenuCreateReq = {
      path: '/',
      name: 'foo',
      kind: 'folder',
    };

    const createRes = await postAdmin('menu/create', data2);
    const data: MenuReadReq = {
      path: '/',
    };
    const readRes = await postAdmin('menu/read', data);

    console.log({ readRes: JSON.stringify(readRes) })
    expect(readRes.status).toBe(200);
  });
  it('should create a folder under root', async () => {
    const data: MenuReadReq = {
      path: '/',
    };
    const readRes = await postAdmin('menu/read', data);

    const data2: MenuCreateReq = {
      path: '/',
      name: 'foo',
      kind: 'folder',
    };

    const createRes = await postAdmin('menu/create', data2);

    console.log({ createRes })

    const readRes2 = await postAdmin('menu/read', {
      path: '/',
    });

    expect(readRes2.status).toBe(200);

    const readRes3 = await postAdmin('menu/read', data);

    const obj1 = data2;

    const obj2 = readRes3.data;



    console.log({ obj1: JSON.stringify(obj1), obj2: JSON.stringify(obj2) })

    // expect(isSubset(obj1, obj2)).toBe(true);
    expect(obj1.path + obj1.name).toBe(obj2.children[0].path)
    expect(obj1.name).toBe(obj2.children[0].name)
    expect(obj1.kind).toBe(obj2.children[0].kind)
  });

  it('should do the CRUD "happy path"', async () => {
    // Create Menu Item

    const readMenuRoot = await postAdmin('menu/read', {
      path: '/',
    });

    expect(readMenuRoot.status).toBe(200)

    const body: MenuItemTreeRef = {
      path: '/',
      id: readMenuRoot.data.id,
      name: 'foo',
      kind: 'folder'
    };

    const createRetVal = (await postAdmin(
      'menu/create',
      body,
    )) as AxiosResponse<MenuCreateRes>;

    expect(body.path + body.name).toBe(createRetVal.data.path)
    expect(body.name).toBe(createRetVal.data.name)
    expect(body.kind).toBe(createRetVal.data.kind)

    // Read the created Menu Item

    const readRetVal2 = (await postAdmin('menu/read', {
      path: createRetVal.data.path,
    })) as AxiosResponse<MenuReadRes>;


    expect(body.path + body.name).toBe(readRetVal2.data.path)
    expect(body.name).toBe(readRetVal2.data.name)
    expect(body.kind).toBe(readRetVal2.data.kind)

    const body2: MenuUpdateReq = {
      path: createRetVal.data.path,
      name: 'bar'
    };

    // Checking if update is correct.

    const updateRetVal = await postAdmin('menu/update', body2);

    let resPayload3: MenuUpdateRes = updateRetVal.data;

    console.log({ res: updateRetVal.data, req: body2 })

    expect(updateRetVal.data.name).toBe(body2.name);
    expect(updateRetVal.data.path).toBe(body2.path);
    expect(updateRetVal.data.kind).toBe(body.kind);
    expect(updateRetVal.data.children).toStrictEqual([]);



    // Deleting and checking if the file was indeed deleted.

    const body3 = {
      id: resPayload3.id,
      path: resPayload3.path,
    };

    const createFileBody: MenuItemTreeRef = {
      path: '/',
      id: readMenuRoot.data.id,
      name: 'foo'
    };

    const createFileRetVal = await postAdmin('menu/create', createFileBody);

    expect(createFileRetVal.status).toBe(200);

    const updateFileBody: MenuItemTreeRef = {
      id: readMenuRoot.data.id,
      path: createFileRetVal.data.path,
      kind: 'folder',
      name: 'bar'
    };

    const updateFileRetVal = (await postAdmin(
      'menu/update',
      updateFileBody,
    )) as AxiosResponse<MenuUpdateReq>;

    expect(
      updateFileRetVal.data.name
    ).toBe('bar');

    const deleteRetVal = await postAdmin('menu/delete', body3);

    expect(deleteRetVal.status).toBe(200);

    const readRetVal3 = await postAdmin('menu/read', { path: body3.path });

    expect(readRetVal3.status).toBe(404);
  });
  it('should do the CRUD "sad path"', async () => {
    const createRetVal = await postAdmin('menu/create', { path: '/foo', id: 'bar' });

    expect(createRetVal.status).toBe(404);

    const readRetVal = await postAdmin('menu/read', {
      id: 'foo',
      path: 'bar',
    });

    expect(readRetVal.status).toBe(422);

    const updateRetVal = await postAdmin('menu/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(422);

    const updateRetVal2 = await postAdmin('menu/update', {
      path: 'bar',
      id: 'foo',
      name: 'john',
    });

    expect(updateRetVal2.status).toBe(404);

    const updateRetVal3 = await postAdmin('menu/update', {
      path: 'bar',
      id: 'foo',
    });

    expect(updateRetVal3.status).toBe(404);

    const updateRetVal4 = await postAdmin('menu/update', {});

    expect(updateRetVal3.status).toBe(404);

    const deleteRetVal = await postAdmin('menu/delete', { foo: 'bar' });

    expect(deleteRetVal.status).toBe(422);

    const deleteRetVal2 = await postAdmin('menu/delete', { path: 'bar', id: 'foo' });

    expect(deleteRetVal2.status).toBe(404);
  });
});
