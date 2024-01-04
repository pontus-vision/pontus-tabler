import {
  MenuCreateRes,
  MenuItemTreeRef,
  MenuReadRes,
  MenuUpdateReq,
  MenuUpdateRes,
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

  it('should do the CRUD "happy path"', async () => {
    const body: MenuItemTreeRef = {
      name: 'string',
      kind: MenuItemTreeRef.KindEnum.Folder,
      path: 'string',
      children: [
        {
          name: 'string',
          kind: MenuItemTreeRef.KindEnum.Folder,
          path: 'string',
          children: [],
        },
      ],
    };

    const createRetVal = await post('menu/create', body);

    let resPayload: MenuCreateRes = createRetVal.data;
    let id = resPayload.id;

    expect(createRetVal.data.name).toBe(body.name);

    const readRetVal = await post('menu/read', {
      id,
    });

    let resPayload2: MenuReadRes = readRetVal.data;

    console.log(`res2: ${JSON.stringify(resPayload2)}`);

    expect(readRetVal.data.name).toBe(body.name);

    const body2: MenuUpdateReq = {
      name: 'string',
      kind: MenuItemTreeRef.KindEnum.Folder,
      path: 'string',
      children: [
        {
          name: 'string2',
          kind: MenuItemTreeRef.KindEnum.Folder,
          path: 'string',
          children: [],
        },
      ],
      id: resPayload.id,
    };

    const updateRetVal = await post('menu/update', body2);

    let resPayload3: MenuUpdateRes = updateRetVal.data;

    expect(resPayload3.name).toBe(body2.name);
    expect(resPayload3.kind).toBe(body2.kind);
    expect(resPayload3.path).toBe(body2.path);
    expect(JSON.stringify(resPayload3.children)).toBe(
      JSON.stringify(body2.children),
    );

    const body3 = {
      id: resPayload3.id,
    };

    const deleteRetVal = await post('menu/delete', body3);

    expect(deleteRetVal.status).toBe(200);

    const readRetVal2 = await post('menu/read', body3);

    expect(readRetVal2.status).toBe(404);
  });
  it('should do the CRUD "sad path"', async () => {
    const createRetVal = await post('menu/create', {});

    expect(createRetVal.status).toBe(400);

    const readRetVal = await post('menu/read', {
      id: 'foo',
    });

    expect(readRetVal.status).toBe(404);

    const updateRetVal = await post('menu/update', { foo: 'bar' });

    expect(updateRetVal.status).toBe(400);

    const deleteRetVal = await post('menu/delete', { foo: 'bar' });

    let resPayload4 = deleteRetVal.data;

    expect(deleteRetVal.status).toBe(400);
  });
});
