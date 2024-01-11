import * as utils from '../utils/writer';
import { Request, Response, NextFunction } from 'express';
import {
  TableDataCreateReq,
  TableDataDeleteReq,
  TableDataReadReq,
  TableDataUpdateReq,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { upsertDashboard } from '../service/DashboardService';
import {
  deleteTableData,
  readTableData,
  updateTableData,
  upsertTableData,
} from '../service/TableDataService';

export const tableDataCreatePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: TableDataCreateReq,
) => {
  try {
    const response = await upsertTableData(body);

    res.status(201);
    res.json(response);

    return res;
  } catch (error) {
    console.log({ error });
    res.status(error.code);
    res.json(error?.message || error);
    return res;
  }
};

export const tableDataReadPOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: TableDataReadReq,
) => {
  try {
    const response = await readTableData(body);

    res.status(201);
    res.json(response);
    return res;
  } catch (error) {
    res.status(error.code);
    res.json(error.message || error);
    return res;
  }
};

export const tableDataUpdatePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: TableDataUpdateReq,
) => {
  try {
    const response = await updateTableData(body);

    res.status(200);
    res.json(response);
    return res;
  } catch (error) {
    res.status(error.code);
    res.json(error);
    return res;
  }
};
export const tableDataDeletePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: TableDataDeleteReq,
) => {
  try {
    const response = await deleteTableData(body);

    res.status(200);
    res.json(response);

    return res;
  } catch (error) {
    console.log({ error, body });
    res.status(error.code || error);
    res.json(error.message || error);
    return res;
  }
};
