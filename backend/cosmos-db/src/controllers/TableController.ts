import {
  ReadPaginationFilter,
  TableCreateReq,
  TableDeleteReq,
  TableReadReq,
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

export const tableCreatePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: TableCreateReq,
): Promise<Response> => {
  try {
    if (body === undefined) {
      throw { code: 400, message: 'No properties defined' };
    }
    const response = await upsertTable(body);
    res.status(201);
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

export const tableReadPOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: TableReadReq,
) => {
  try {
    if (body === undefined) {
      throw { code: 400, message: 'No properties defined' };
    }
    const response = await readTableById(body);

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

export const tableDeletePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: TableDeleteReq,
) => {
  try {
    const response = await deleteTable(body);

    res.status(200);
    res.json(response);
  } catch (error) {
    res.status(500);
    res.json(error);
    return res;
  }
};

export const tableUpdatePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: TableUpdateReq,
) => {
  try {
    const response = await upsertTable(body);

    res.status(200);
    res.json(response);

    return res;
  } catch (error) {
    res.status(500);
    res.json(error);
    return res;
  }
};

export const tablesReadPOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: ReadPaginationFilter,
) => {
  try {
    const response = await readTables(body);

    const obj: TablesReadRes = {
      tables: response.values,
      totalTables: response.count,
    };

    res.status(200);
    res.json(obj);

    return res;
  } catch (error) {
    if (error?.code && error?.message) {
      if (error.code === 404) {
        res.status(error.code);
        res.json([]);
        return res;
      }
      res.status(error.code);
      res.json(error.message);
      return res;
    }
    res.status(500);
    res.json(error);
    return res;
  }
};
