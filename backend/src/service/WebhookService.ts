import { COSMOS_DB, dbSource, DELTA_DB } from '../consts';
import { InternalServerError } from '../generated/api';
import { WebhookSubscriptionReq, WebhookSubscriptionRes } from "../typescript/api"

import * as deltadb from './delta/index';

export const createWebhook = async (
  data: WebhookSubscriptionReq,
): Promise<WebhookSubscriptionRes> => {
  if (dbSource === COSMOS_DB) {
    // return cdb.createMenuItem(data);
  } else if (dbSource === DELTA_DB) {
    return deltadb.createWebhook(data);
  }
  throw new InternalServerError(`invalid data source. ${dbSource}`);
};
