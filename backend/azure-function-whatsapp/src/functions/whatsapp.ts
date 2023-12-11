import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
// import { crypto } from 'crypto';
import * as crypto from 'crypto';
import { WhatsappWebHook } from './types';

const hubVerifyToken = process.env.HUB_VERIFY_TOKEN || 'test';
const hubVerifySha = process.env.HUB_VERIFY_SHA || 'sha256';
const whatsappToken = process.env.WHATSAPP_TOKEN;

export const generateXHub256Sig = (body: string, appSecret: string) => {
  return crypto
    .createHmac(hubVerifySha, appSecret)
    .update(body, 'utf-8')
    .digest('hex');
};

export const verifySig = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<{ valid: boolean; body: string }> => {
  const isPost = request.method === 'POST';
  const body = await request.text();

  if (!isPost) {
    return { valid: true, body };
  }

  const hasSignature = request.headers.get('x-hub-signature-256').toString();

  if (!hasSignature) {
    context.error('FAILED TO FIND header x-hub-signature-256');

    return { valid: false, body };
  }

  const signature = hasSignature.replace(`${hubVerifySha}=`, '');
  const appSecret = process.env.APP_SECRET;

  if (!appSecret) {
    context.error('FAILED TO FIND APP_SECRET');
    return { valid: false, body };
  }
  const generatedSignature = generateXHub256Sig(body, appSecret);

  context.log(
    `generatedSignature = ${generatedSignature}; signature = ${signature} `,
  );
  return { valid: generatedSignature === signature, body };
};

export const sendReply = async (
  phone_number_id: string,
  whatsapp_token: string,
  to: string,
  reply_message: string,
): Promise<Response> => {
  let json = {
    messaging_product: 'whatsapp',
    type: 'text',
    to: to,
    text: { body: reply_message },
  };
  // let data = JSON.stringify(json);
  // let path = '/v17.0/' + phone_number_id + '/messages';
  // let options = {
  //   host: 'graph.facebook.com',
  //   path: path,
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${whatsapp_token}`,
  //   },
  // };

  // const headers = new Headers();
  // headers.append('Content-Type', 'application/json');
  // headers.append('Authorization', `Bearer ${whatsapp_token}`);

  const ret = fetch(
    `https://graph.facebook.com/v17.0/${phone_number_id}/messages`,

    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${whatsapp_token}`,
      },
      body: JSON.stringify(json),
    },
  );

  return ret;
  // let callback = (response) => {
  //   let str = "";
  //   response.on("data", (chunk) => {
  //     str += chunk;
  //   });
  //   response.on("end", () => {
  //   });
  // };
  // let req = https.request(options, callback);
  // req.on("error", (e) => {});
  // req.write(data);
  // req.end();
};

export const whatsapp = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {
  context.log(`Http function processed request for url "${request.url}"`);

  context.log(`request = ${JSON.stringify(request)}`);
  request.headers.forEach((val: String, key: string) =>
    context.log(`${key} = ${val}`),
  );

  const verification = await verifySig(request, context);

  if (!verification.valid) {
    const retVal: HttpResponseInit = {
      body: 'error: Unable to verify the signature',
      status: 401,
    };
    return retVal;
  }

  if (request.method === 'GET') {
    context.log(
      `Got GET request; query('hub.mode') is ${request.query.get('hub.mode')}`,
    );
    context.log(
      `Got GET request; query('hub.verify_token') is ${request.query.get(
        'hub.verify_token',
      )}; hubVerifyToken = ${hubVerifyToken}`,
    );

    if (
      request?.query.get('hub.mode') === 'subscribe' &&
      request?.query.get('hub.verify_token') === hubVerifyToken
    ) {
      const retVal: HttpResponseInit = {
        body: request?.query.get('hub.challenge'),
        status: 200,
      };
      return retVal;
    }
  }

  const reqText = verification.body;

  if (reqText) {
    const reqVal: WhatsappWebHook = JSON.parse(reqText);

    // const name = request.query.get('name') || (await request.text()) || 'world';

    context.log(`Got a POST Message ${JSON.stringify(reqVal)}`);
    for (const entry of reqVal.entry) {
      for (const change of entry.changes) {
        for (const msg of change.value.messages){
          const ret2 = await sendReply(change.value.metadata.phone_number_id, whatsappToken, msg.from, msg.text.body);
          context.log(`got ${ret2.status}-  ${JSON.stringify(ret2.headers)}; ${await ret2.text()}`);
        }
      }
    }
  }
  return { body: `${request.body}`, status: 200 };
};

app.http('whatsapp', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: whatsapp,
});
