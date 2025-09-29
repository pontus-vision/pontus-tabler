import { JobCreateReq, JobCreateRes, JobReadReq, JobReadRes, JobUpdateReq, JobUpdateRes } from '../typescript/api/index';

import { InternalServerError, JobDeleteReq, JobDeleteRes } from '../generated/api';
import * as cdb from './cosmosdb/index';
import * as deltadb from './delta/index';
import { COSMOS_DB, dbSource, DELTA_DB } from '../consts';

export const createJob = async (
  data: JobCreateReq
): Promise<JobCreateRes> => {
  if (dbSource === COSMOS_DB) {
    //return cdb.createMenuItem(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createJob(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const readJob = async (
  data: JobReadReq
): Promise<JobReadRes> => {
  if (dbSource === COSMOS_DB) {
    //return cdb.createMenuItem(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.readJob(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const updateJob = async (
  data: JobUpdateReq
): Promise<JobUpdateRes> => {
  if (dbSource === COSMOS_DB) {
    //return cdb.createMenuItem(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.updateJob(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};

export const deleteJob = async (
  data: JobDeleteReq
): Promise<JobDeleteRes> => {
  if (dbSource === COSMOS_DB) {
    //return cdb.createMenuItem(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.deleteJob(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};