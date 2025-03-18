import {
  MenuCreateReq,
  MenuUpdateReq,
  MenuDeleteReq,
  MenuCreateRes,
  MenuReadRes,
  MenuItemTreeRef,
} from '../../typescript/api/index';
import { DASHBOARDS, MENU } from '../../consts';
import { generateUUIDv6, runQuery } from '../../db-utils';
import { NotFoundError } from '../../generated/api';

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

  console.log({ obj: JSON.stringify(obj) })
  if (obj.kind === 'file') {
    return obj
  }
  for (const child of obj?.children) {
    const result = findNestedObject(path, child)
    if (result) return result
  }
}

const createTree = async (item: MenuItemTreeRef, path: string) => {

  const res = await runQuery(
    `CREATE TABLE IF NOT EXISTS ${MENU} (id STRING, tree_obj_str STRING) USING DELTA LOCATION '/data/pv/${MENU}';`,
  );

  let res2 = await runQuery(`SELECT * FROM ${MENU}`)

  if (res2.length === 0) {
    const obj: MenuItemTreeRef = {
      children: [],
      id: generateUUIDv6(),
      kind: 'folder',
      name: 'root',
      path: '/'
    }
    const resInsert = await runQuery(`INSERT INTO ${MENU} (id, tree_obj_str) VALUES ('${generateUUIDv6()}','${JSON.stringify(obj)}')`)

    res2 = await runQuery(`SELECT * FROM ${MENU}`)
  }

  const treeObjStr = res2[0]['tree_obj_str'] as string

  const treeObjId = res2[0]['id']

  const treeObj = JSON.parse(treeObjStr)

  let obj

  if (item.kind === 'folder') {
    obj = { ...item, children: [] }
  } else {
    obj = item
  }

  console.log({ objOnCreate: obj })

  const treeObjModified = updateAndRetrieveTree(path, treeObj, (node) => { node.children.push({ ...obj, id: generateUUIDv6(), path: item.path + item.name }) })

  if (!treeObjModified) {
    throw new NotFoundError(`No menu item found at path "${path}"`)
  }

  const treeObjStr2 = JSON.stringify(treeObjModified)

  const res3 = await runQuery(`UPDATE ${MENU} SET tree_obj_str = '${treeObjStr2}' WHERE id = '${treeObjId}'`)

  const res4 = await runQuery(`SELECT * FROM ${MENU}`)

  console.log({ res4, treeObjModified, obj, item })

  const treeObjFinal = JSON.parse(res4[0]['tree_obj_str'])
  console.log({ item, treeObjFinal: JSON.stringify(treeObjFinal) })
  return findNestedObject(item.path + item.name, treeObjFinal)
}

export const createMenuItem = async (
  data: MenuCreateReq,
): Promise<MenuCreateRes | any> => {
  return createTree(data, data.path)
};

export const updateMenuItem = async (
  data: MenuCreateReq | MenuUpdateReq,
): Promise<MenuCreateRes> => {
  const treeObjStr = JSON.stringify(data)

  const res = await runQuery(`SELECT * FROM ${MENU}`)

  const treeObj = JSON.parse(res[0]['tree_obj_str'])

  const treeUpdated = updateAndRetrieveTree(data.path, treeObj, (node) => { node.name = data.name })

  if (!treeUpdated) {
    throw new NotFoundError(`No menu item found at path "${data.path}"`)
  }

  const treeObjStr2 = JSON.stringify(treeUpdated)

  const treeObjId = res[0]['id']


  const res3 = await runQuery(`UPDATE ${MENU} SET tree_obj_str = '${treeObjStr2}' WHERE id = '${treeObjId}'`)

  const res2 = await runQuery(`SELECT * FROM ${MENU}`)


  const treeObj2 = JSON.parse(res2[0]['tree_obj_str'])

  const retObj = findNestedObject(data.path, treeObj2)

  console.log({ retObj })

  return retObj
};

export const readMenuTree = async (
  path: string,
): Promise<MenuReadRes> => {

  const res = await runQuery(
    `CREATE TABLE IF NOT EXISTS ${MENU} (id STRING, tree_obj_str STRING) USING DELTA LOCATION '/data/pv/${MENU}';`,
  );

  let res2 = await runQuery(`SELECT * FROM ${MENU}`)

  if (res2.length === 0) {
    const obj: MenuItemTreeRef = {
      children: [],
      id: generateUUIDv6(),
      kind: 'folder',
      name: 'root',
      path: '/'
    }
    const resInsert = await runQuery(`INSERT INTO ${MENU} (id, tree_obj_str) VALUES ('${generateUUIDv6()}','${JSON.stringify(obj)}')`)

    res2 = await runQuery(`SELECT * FROM ${MENU}`)
  }

  const treeObj = JSON.parse(res2[0]['tree_obj_str'])

  const tree = findNestedObject(path, treeObj)

  if (!tree) {
    throw new NotFoundError(`No menu item found at path "${path}"`)
  }

  return tree
};

export const deleteMenuItem = async (data: MenuDeleteReq): Promise<string> => {
  const res = await runQuery(`SELECT * FROM ${MENU}`)

  const treeObj = JSON.parse(res[0]['tree_obj_str'])

  let parentPath
  const parentSplit = data.path.split(/(\/)/);
  if (parentSplit.length < 2) {
    const parentSplice = parentSplit.splice(0, -2)
    parentPath = parentSplice.join()
  } else {
    parentPath = "/"
  }

  console.log({ path: data.path, parentPath })


  const updatedTree = updateAndRetrieveTree(parentPath, treeObj, (node) => {
    node.children = node.children.filter(el => el.path !== data.path)
  })
  if (!updatedTree) {
    throw new NotFoundError(`No menu item found at path "${data.path}"`)
  }

  console.log({ updatedTree })


  const treeObjId = res[0]['id']

  const updatedTreeStr = JSON.stringify(updatedTree)

  const res3 = await runQuery(`UPDATE ${MENU} SET tree_obj_str = '${updatedTreeStr}' WHERE id = '${treeObjId}'`)

  return 'deleted'
};
