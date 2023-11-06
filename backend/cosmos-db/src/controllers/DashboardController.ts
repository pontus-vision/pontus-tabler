import * as utils from '../utils/writer';
import { ZodType, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import {
  DashboardCreateReq,
  DashboardDeleteReq,
  DashboardUpdateReq,
  DashboardReadRes,
  DashboardReadReq,
  ReadPaginationFilter,
  DashboardsReadRes,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import {
  upsertDashboard,
  readDashboardById,
  deleteDashboard,
  readDashboards,
  countDashboardsRecords,
} from '../service/DashboardService';
import { Request, Response, NextFunction } from 'express';

export const dashboardCreatePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: DashboardCreateReq,
): Promise<Response> => {
  try {
    if (body === undefined) {
      // res.status(400);
      // res.json({ message: 'Body is undefined' });
      // return res
      throw { code: 400, message: 'No properties defined' };
    }
    const response = await upsertDashboard(body);
    res.status(200);
    res.json(response);
    return res;
  } catch (error) {
    console.log(JSON.stringify(error));
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

export const dashboardReadPOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: DashboardReadReq,
) => {
  try {
    const response = await readDashboardById(body.id);

    res.status(200);
    res.json(response);
    return res;
  } catch (error) {
    if (error?.message && error?.code) {
      res.status(error.code);
      res.json(error.message);
      return res;
    }

    res.status(500);
    res.json(error);

    return res;
  }
};
export async function dashboardDeletePOST(
  req: Request,
  res: Response,
  next: NextFunction,
  body: DashboardDeleteReq,
) {
  try {
    const response = await deleteDashboard(body);

    res.status(200);
    res.json(response);

    return res;
  } catch (error) {
    res.status(500);
    res.json(error);

    return res;
  }
}

export const dashboardUpdatePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: DashboardUpdateReq,
) => {
  try {
    if (body === undefined) {
      throw { code: 400, message: 'No properties defined' };
    }
    const response = await upsertDashboard(body);

    res.status(200);
    res.json(response);
    return res;
  } catch (error) {
    res.status(500);
    res.json(error);
    return res;
  }
};

export async function dashboardsReadPOST(
  req: Request,
  res: Response,
  next: NextFunction,
  body: ReadPaginationFilter,
) {
  try {
    const response = await readDashboards(body);

    const obj: DashboardsReadRes = {
      dashboards: response.dashboards,
      totalDashboards: response.totalDashboards,
    };

    console.log(obj);
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
}
