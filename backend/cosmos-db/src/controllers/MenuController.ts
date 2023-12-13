import {
  MenuCreateReq,
  MenuDeleteReq,
  MenuReadReq,
  MenuUpdateReq,
  ReadPaginationFilter,
  TableDeleteReq,
  TableUpdateReq,
  TablesReadRes,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import {
  deleteTable,
  readTableById,
  readTables,
  upsertTable,
} from '../service/TableService';
import { Request, Response, NextFunction } from 'express';
import {
  deleteDirectory,
  readDirectoryById,
  upsertDirectory,
} from '../service/MenuService';

export const menuCreatePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: MenuCreateReq,
): Promise<Response> => {
  try {
    if (body === undefined) {
      throw { code: 400, message: 'No properties defined' };
    }
    const response = await upsertDirectory(body);
    res.json(response);
    res.status(200);

    return res;
  } catch (error) {
    if (error?.code && error?.message) {
      res.status(error.code);
      res.json(error.message);
      return res;
    }
    res.status(500);
    res.json(error);
    return res;
  }
};

export const menuReadPOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: MenuReadReq,
) => {
  try {
    const response = await readDirectoryById(body.id);

    res.status(200);
    res.json(response);

    return res;
  } catch (error) {
    if (error?.code && error?.message) {
      res.status(error.code);
      res.json(error.message);
      return res;
    }
    res.status(500);
    res.json(error);
    return res;
  }
};

export const menuDeletePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: MenuDeleteReq,
) => {
  try {
    const response = await deleteDirectory(body);

    res.status(200);
    res.json(response);
  } catch (error) {
    res.status(500);
    res.json(error);
    return res;
  }
};

export const menuUpdatePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: MenuUpdateReq,
) => {
  try {
    const response = await upsertDirectory(body);

    res.status(200);
    res.json(response);

    return res;
  } catch (error) {
    res.status(500);
    res.json(error);
    return res;
  }
};
