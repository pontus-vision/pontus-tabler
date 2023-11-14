import { NextFunction } from 'express';
import * as utils from '../utils/writer';

export async function tableCreatePOST(
  req: Request,
  res: Response,
  next: NextFunction,
  body,
) {
  try {
    // const response = await Default.tableCreatePOST(body);
    // utils.writeJson(res, response);
  } catch (error) {
    console.log(error);
    utils.writeJson(res, error);
  }
}
export async function tableDeletePOST(req, res, next, body) {
  try {
    // const response = await Default.tableDeletePOST(body);
    // utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}
export async function tableReadPOST(req, res, next, body) {
  try {
    // const response = await Default.tableReadPOST(body);
    // utils.writeJson(res, response);
  } catch (error) {
    next(error);
  }
}
export async function tableUpdatePOST(req, res, next, body) {
  try {
    // const response = await Default.tableUpdatePOST(body);
    // utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}
