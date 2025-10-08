import {
  MenuCreateReq,
  MenuUpdateReq,
  MenuDeleteReq,
  MenuCreateRes,
  MenuReadRes,
  MenuItemTreeRef,
} from '../../typescript/api/index';
import { DASHBOARDS, MENU, schema, schemaSql } from '../../consts';
import { generateUUIDv6, runQuery } from '../../db-utils';
import { NotFoundError } from '../../generated/api/resources';

const updateAndRetrieveTree = (path: string, obj: any, modifyCallback: (node) => void) => {
  if (path === obj.path) {
    modifyCallback(obj)
    return obj
  }
  if (obj.kind === 'file') {
    return obj
  }
  for (const child of obj?.children) {
    const result = updateAndRetrieveTree(path, child, modifyCallback)
    if (result) return obj
  }
}

const findNestedObject = (path: string, obj: any) => {
  if (path === obj.path) {
    return obj
  }

  if (obj.kind === 'file') {
    return obj
  }
  for (const child of obj?.children) {
    const result = findNestedObject(path, child)
    if (result) return result
  }
}

const createTree = async (item: MenuItemTreeRef, path: string) => {

  let res2 = await runQuery(`SELECT * FROM ${schemaSql}${MENU}`);

  if (res2.length === 0) {
    const rootObj: MenuItemTreeRef = {
      children: [],
      id: generateUUIDv6(),
      kind: 'folder',
      name: 'root',
      path: '/'
    };
    await runQuery(
      `INSERT INTO ${schemaSql}${MENU} (id, tree_obj_str) VALUES (?, ?)`,
      [generateUUIDv6(), JSON.stringify(rootObj)]
    );
    res2 = await runQuery(`SELECT * FROM ${schemaSql}${MENU}`);
  }

  const treeObjStr = res2[0]['tree_obj_str'] as string;
  const treeObjId = res2[0]['id'];
  const treeObj = JSON.parse(treeObjStr);

  const obj = item.kind === 'folder' ? { ...item, children: [] } : item;

  const treeObjModified = updateAndRetrieveTree(path, treeObj, (node) => {
    node.children.push({
      ...obj,
      id: generateUUIDv6(),
      path: item.path + item.name,
    });
  });

  if (!treeObjModified) {
    throw new NotFoundError(`No menu item found at path "${path}"`);
  }

  const treeObjStr2 = JSON.stringify(treeObjModified);

  await runQuery(
    `UPDATE ${schemaSql}${MENU} SET tree_obj_str = ? WHERE id = ?`,
    [treeObjStr2, treeObjId]
  );

  const res4 = await runQuery(`SELECT * FROM ${schemaSql}${MENU}`);

  const treeObjFinal = JSON.parse(res4[0]['tree_obj_str']);

  return findNestedObject(item.path + item.name, treeObjFinal);
};


export const createMenuItem = async (
  data: MenuCreateReq,
): Promise<MenuCreateRes | any> => {
  return createTree(data, data.path)
};

export const updateMenuItem = async (
  data: MenuCreateReq | MenuUpdateReq,
): Promise<MenuCreateRes> => {
  const res = await runQuery(`SELECT * FROM ${schemaSql}${MENU}`);
  if (res.length === 0) {
    throw new NotFoundError("No menu data found");
  }

  const treeObj = JSON.parse(res[0]['tree_obj_str']);

  const treeUpdated = updateAndRetrieveTree(data.path, treeObj, (node) => {
    node.name = data.name;
  });

  if (!treeUpdated) {
    throw new NotFoundError(`No menu item found at path "${data.path}"`);
  }

  const treeObjStr2 = JSON.stringify(treeUpdated);
  const treeObjId = res[0]['id'];

  await runQuery(
    `UPDATE ${schemaSql}${MENU} SET tree_obj_str = ? WHERE id = ?`,
    [treeObjStr2, treeObjId]
  );

  const res2 = await runQuery(`SELECT * FROM ${schemaSql}${MENU}`);
  const treeObj2 = JSON.parse(res2[0]['tree_obj_str']);
  const retObj = findNestedObject(data.path, treeObj2);

  return retObj;
};


export const readMenuTree = async (
  path: string,
): Promise<MenuReadRes> => {

  // Step 2: Query current contents
  let res2 = await runQuery(`SELECT * FROM ${schemaSql}${MENU}`);

  // Step 3: If empty, insert default root menu
  if (res2.length === 0) {
    const rootId = generateUUIDv6();
    const obj: MenuItemTreeRef = {
      children: [],
      id: rootId,
      kind: 'folder',
      name: 'root',
      path: '/'
    };

    await runQuery(
      `INSERT INTO ${schemaSql}${MENU} (id, tree_obj_str) VALUES (?, ?)`,
      [generateUUIDv6(), JSON.stringify(obj)]
    );

    res2 = await runQuery(`SELECT * FROM ${schemaSql}${MENU}`);
  }

  // Step 4: Parse and find path
  const treeObj = JSON.parse(res2[0]['tree_obj_str']);
  const tree = findNestedObject(path, treeObj);

  if (!tree) {
    throw new NotFoundError(`No menu item found at path "${path}"`);
  }

  return tree;
};


export const deleteMenuItem = async (data: MenuDeleteReq): Promise<string> => {
  const res = await runQuery(`SELECT * FROM ${schemaSql}${MENU}`);

  const treeObj = JSON.parse(res[0]['tree_obj_str']);

  let parentPath;
  const parentSplit = data.path.split(/(\/)/);
  if (parentSplit.length < 2) {
    const parentSplice = parentSplit.splice(0, -2);
    parentPath = parentSplice.join();
  } else {
    parentPath = "/";
  }

  const updatedTree = updateAndRetrieveTree(parentPath, treeObj, (node) => {
    node.children = node.children.filter(el => el.path !== data.path);
  });

  if (!updatedTree) {
    throw new NotFoundError(`No menu item found at path "${data.path}"`);
  }

  const treeObjId = res[0]['id'];
  const updatedTreeStr = JSON.stringify(updatedTree);

  await runQuery(
    `UPDATE ${schemaSql}${MENU} SET tree_obj_str = ? WHERE id = ?`,
    [updatedTreeStr, treeObjId]
  );

  return 'deleted';
};

