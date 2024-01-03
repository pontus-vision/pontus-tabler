import {
  MenuCreateReq,
  MenuDeleteReq,
  MenuItemTreeRef,
  MenuReadReq,
  MenuUpdateReq,
} from 'pontus-tabler/src/pontus-api/typescript-fetch-client-generated';
import { Request, Response, NextFunction } from 'express';
import {
  createMenuItem,
  deleteMenuItem,
  readMenuItemByPath,
  updateMenuItem,
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
    const response = await createMenuItem(body);
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
    const response = await readMenuItemByPath(body.path);

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
    const response = await deleteMenuItem(body);

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
    const response = await updateMenuItem(body);

    res.status(200);
    res.json(response);

    return res;
  } catch (error) {
    res.status(500);
    res.json(error);
    return res;
  }
};
