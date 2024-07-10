import {
  DashboardCreateReq,
  DashboardDeleteReq,
  DashboardUpdateReq,
  DashboardReadReq,
  ReadPaginationFilter,
  DashboardsReadRes,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import {
  upsertDashboard,
  readDashboardById,
  deleteDashboard,
  readDashboards,
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
      throw { code: 400, message: 'No properties defined' };
    }
    const response = await upsertDashboard(body);
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
export const dashboardDeletePOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: DashboardDeleteReq,
) => {
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
};

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

export const dashboardsReadPOST = async (
  req: Request,
  res: Response,
  next: NextFunction,
  body: ReadPaginationFilter,
) => {
  try {
    const response = await readDashboards(body);

    const obj: DashboardsReadRes = {
      dashboards: response.values,
      totalDashboards: response.count,
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
