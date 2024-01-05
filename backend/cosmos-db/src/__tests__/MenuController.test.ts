import {
  MenuItemTreeRef,
  MenuCreateRes,
  MenuReadRes,
  MenuUpdateReq,
  MenuUpdateRes,
  MenuReadReq,
  MenuCreateReq,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { post } from './test-utils';
import { deleteDatabase } from '../utils/cosmos-utils';
import { srv } from '../index';

// // Mock the utils.writeJson function
// jest.mock('../utils/writer', () => ({
//   writeJson: jest.fn(),
// }));

// // Mock the Default service functions
// jest.mock('../service/DefaultService', () => ({
//   dashboardUpdatePOST: jest.fn(),
//   dashboardsReadPOST: jest.fn(),
// }));
function isSubset(obj1, obj2) {
  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      if (obj1[key].length !== obj2[key].length) {
        return false;
      }
      for (let i = 0; i < obj1[key].length; i++) {
        if (
          typeof obj1[key][i] === 'object' &&
          typeof obj2[key][i] === 'object'
        ) {
          if (!isSubset(obj1[key][i], obj2[key][i])) {
            return false;
          }
        } else if (obj1[key][i] !== obj2[key][i]) {
          return false;
        }
      }
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (!isSubset(obj1[key], obj2[key])) {
        return false;
      }
    } else if (obj2[key] !== obj1[key]) {
      return false;
    }
  }
  return true;
}

jest.setTimeout(1000000);

describe('testing Menu', () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    await deleteDatabase('pv_db');
  });

  afterAll(() => {
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
      kind: 'folder',
      name: 'folder',
      children: [{ kind: 'file', children: [], name: 'file1' }],
    };

    const updateRes = await post('menu/update', data2);

    console.log({ updateRes });

    const readRes2 = await post('menu/read', {
      path: updateRes.data?.children[0]?.path,
    });

    expect(readRes2.status).toBe(200);

    const readRes3 = await post('menu/read', {
      path: updateRes.data?.path,
    });

    const obj1 = data2.children[0];

    const obj2 = readRes3.data.children[0];
    console.log({ obj1, obj2 });
    expect(isSubset(obj1, obj2)).toBe(true);
  });

  it('should do the CRUD "happy path"', async () => {
    // Create Menu Item

    const body: MenuItemTreeRef = {
      name: 'string',
      kind: 'folder',
      path: 'string',
      children: [
        {
          name: 'string',
          kind: 'folder',
          path: '/',
          children: [],
        },
      ],
    };

    const createRetVal = await post('menu/create', body);

    let readRetVal: MenuCreateRes = createRetVal.data;

    expect(isSubset(body, readRetVal)).toBeTruthy();

    // Read the created Menu Item

    const readRetVal2 = await post('menu/read', {
      id: readRetVal?.id,
      path: readRetVal?.path,
    });

    expect(isSubset(body, readRetVal2.data)).toBe(true);

    const body2: MenuUpdateReq = {
      name: 'string',
      kind: 'folder',
      path: readRetVal.path,
      children: [
        {
          name: 'string2',
          kind: 'folder',
          children: [],
        },
      ],
      id: readRetVal.id,
    };

    // Checking if update is correct.

    const updateRetVal = await post('menu/update', body2);

    let resPayload3: MenuUpdateRes = updateRetVal.data;

    const { children, ...rest } = body2;
    const { children: children2, ...rest2 } = resPayload3;

    expect(isSubset(rest, rest2)).toBeTruthy();
    expect(
      children2.some((child2) =>
        children.some((child) => isSubset(child, child2)),
      ),
    ).toBeTruthy();

    // Deleting and checking if the file was indeed deleted.

    const body3 = {
      id: resPayload3.id,
      path: resPayload3.path,
    };

    const deleteRetVal = await post('menu/delete', body3);

    expect(deleteRetVal.status).toBe(200);

    const readRetVal3 = await post('menu/read', { path: body3.path });

    expect(readRetVal3.status).toBe(404);
  });
  it('should do the CRUD "sad path"', async () => {
    const createRetVal = await post('menu/create', {});

    expect(createRetVal.status).toBe(400);

    const readRetVal = await post('menu/read', {
      id: 'foo',
      path: 'bar',
    });

    expect(readRetVal.status).toBe(404);

    const updateRetVal = await post('menu/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(400);

    const updateRetVal2 = await post('menu/update', { path: 'bar', id: 'foo' });

    expect(updateRetVal2.status).toBe(404);

    const deleteRetVal = await post('menu/delete', { foo: 'bar' });

    expect(deleteRetVal.status).toBe(400);

    const deleteRetVal2 = await post('menu/delete', { path: 'bar', id: 'foo' });

    expect(deleteRetVal2.status).toBe(404);
  });
});
