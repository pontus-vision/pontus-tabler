import { InternalServerError, BadRequestError } from "../../generated/api/resources"
import { WEBHOOKS_SUBSCRIPTIONS } from "../../consts";
import { generateUUIDv6, runQuery, validateRegex } from "../../db-utils"
import { WebhookSubscriptionReq, WebhookSubscriptionRes } from "../../typescript/api"

export const createWebhook = async (
    data: WebhookSubscriptionReq
  ): Promise<WebhookSubscriptionRes> => {
    try {
      if (!validateRegex(data.tableFilter)) {
        throw new BadRequestError('string is not in a regex compatible format');
      }
  
      await runQuery(`
        CREATE TABLE IF NOT EXISTS webhook_subscriptions (
          id STRING,
          user_id STRING NOT NULL,
          context STRING NOT NULL,
          table_filter STRING NOT NULL,
          operation STRING NOT NULL,
          endpoint STRING NOT NULL,
          secret_token_link STRING NOT NULL
        )
        USING DELTA
        LOCATION "/data/pv/${WEBHOOKS_SUBSCRIPTIONS}";
      `);
  
      const uuid = generateUUIDv6();
  
      await runQuery(
        `INSERT INTO ${WEBHOOKS_SUBSCRIPTIONS} 
          (id, user_id, context, table_filter, endpoint, secret_token_link, operation) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          uuid,
          data.userId,
          data.context,
          data.tableFilter,
          data.endpoint,
          data.secretTokenLink,
          data.operation,
        ]
      );
  
      const res3 = (await runQuery(
        `SELECT * FROM ${WEBHOOKS_SUBSCRIPTIONS} WHERE id = ?`,
        [uuid]
      )) as WebhookSubscriptionRes[];
  
      if (res3.length === 0) {
        throw new InternalServerError('Webhook creation failed: not found after insert');
      }
  
      console.log({ WEBHOOK_CREATION: res3 });
  
      return {
        userId: res3[0]?.['user_id'],
        context: res3[0]?.['context'],
        endpoint: res3[0]?.['endpoint'],
        operation: res3[0]?.['operation'],
        secretTokenLink: res3[0]?.['secret_token_link'],
        tableFilter: res3[0]?.['table_filter'],
        id: res3[0]?.['id'],
      };
    } catch (error) {
      throw new InternalServerError('It was not possible to create a webhook');
    }
  };
  

// const readWebhooks =  async (data:)