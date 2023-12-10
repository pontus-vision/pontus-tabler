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
const hubVerifySha = process.env.HUB_VERIFY_SHA || 'sha256'

export const generateXHub256Sig = (body: string, appSecret: string) => {
  return crypto
    .createHmac(hubVerifySha, appSecret)
    .update(body, 'utf-8')
    .digest('hex');
};

export const verifySig = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<{valid: boolean, body: string}> => {
  const isPost = request.method === 'POST';
  const body = await request.text();

  if (!isPost) {
    return {valid: true,body};
  }

  const hasSignature = request.headers.get('x-hub-signature-256').toString();

  if (!hasSignature) {
    context.error('FAILED TO FIND header x-hub-signature-256');

    return {valid: false, body};
  }

  const signature = hasSignature.replace(`${hubVerifySha}=`, '');
  const appSecret = process.env.APP_SECRET;

  if (!appSecret) {
    context.error('FAILED TO FIND APP_SECRET');
    return {valid: false, body};
  }
  const generatedSignature = generateXHub256Sig(body, appSecret);

  context.log(
    `generatedSignature = ${generatedSignature}; signature = ${signature} `,
  );
  return {valid: generatedSignature === signature, body};
  /*
  if (request.)

  if (
              req.method === 'POST' &&
              req.headers['x-hub-signature-256']
            ) {
              //Removing the prepended 'sha256=' string
              const xHubSignature = req.headers['x-hub-signature-256']
                .toString()
                .replace('sha256=', '');

              let bodyBuf: Buffer[] = [];
              req.on('data', (chunk) => {
                bodyBuf = bodyBuf + chunk; // linter bug where push() and "+=" throws an error

                if (bodyBuf.length > 1e6) req.destroy(); // close connection if payload is larger than 1MB for some reason
              });

              req.on('end', () => {
                const body = Buffer.concat(bodyBuf).toString();

                const generatedSignature = generateXHub256Sig(
                  body,
                  this.config[WAConfigEnum.AppSecret],
                );

                const cbBody: w.WebhookObject = JSON.parse(body);

                if (generatedSignature == xHubSignature) {
                  const responseStatus = 200;
                  LOGGER.log(
                    'x-hub-signature-256 header matches generated signature',
                  );
                  cb(responseStatus, req.headers, cbBody, res, undefined);
                } else {
                  const errorMessage = "error: x-hub signature doesn't match";
                  const responseStatus = 401;

                  LOGGER.log(errorMessage);
                  res.writeHead(responseStatus);
                  res.end(errorMessage);

                  cb(
                    responseStatus,
                    req.headers,
                    cbBody,
                    undefined,
                    new Error(errorMessage),
                  );
                }
              });

              req.on('error', (err) => {
                const responseStatus = 500;
                cb(responseStatus, req.headers, undefined, res, err);
              });
            }
            */
};

export const whatsapp = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {
  context.log(`Http function processed request for url "${request.url}"`);
  
  context.log(`request = ${JSON.stringify(request)}`);
  request.headers.forEach((val: String, key:string )=> context.log(`${key} = ${val}`));

  const verification = await verifySig(request, context);

  if (!verification.valid ) {
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
  }
  return { body: `${request.body}`, status: 200 };
};

app.http('whatsapp', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: whatsapp,
});
