import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
// import { crypto } from 'crypto';
import * as crypto from 'crypto';
import { OpenAIMessage, WhatsappWebHook } from './types';
import {
  OpenAIClient,
  AzureKeyCredential,
  ChatCompletions,
} from '@azure/openai';
import { BlobServiceClient } from '@azure/storage-blob';

const hubVerifyToken = process.env.HUB_VERIFY_TOKEN || 'test';
const hubVerifySha = process.env.HUB_VERIFY_SHA || 'sha256';
const whatsappToken = process.env.WHATSAPP_TOKEN;

const azureEndpoint = process.env['ENDPOINT'] || '<endpoint>';
// Your Azure OpenAI API key
const azureApiKey = process.env['AZURE_API_KEY'];
// Your Azure Cognitive Search endpoint, admin key, and index name
const azureSearchEndpoint =
  process.env['AZURE_SEARCH_ENDPOINT'] ||
  'https://whatsapp-chat-2.search.windows.net';
const azureSearchKey = process.env['AZURE_SEARCH_KEY'] || '<search key>';
const azureSearchIndexName =
  process.env['AZURE_SEARCH_INDEX'] || "'whatsapp-chat-idx-index'";
const azureSearchDeploymentId =
  process.env['AZURE_SEARCH_DEPLOYMENT_ID'] || 'gpt-35-turbo';
const azureOpenAISystemRole =
  process.env['AZURE_OPENAI_SYSTEM_ROLE'] ||
  'You are an AI estate agent that helps people find information about new property builds (primary market) in Brazil.';

const azureBlobConnectionString = process.env['AZURE_BLOB_CONNECTION_STRING'];
const azureBlobContainerName = process.env['AZURE_BLOB_CONTAINER_NAME'];

const openAIclient = new OpenAIClient(
  azureEndpoint,
  new AzureKeyCredential(azureApiKey),
);

const blobServiceClient = BlobServiceClient.fromConnectionString(
  azureBlobConnectionString,
);
const containerClient = blobServiceClient.getContainerClient(
  azureBlobContainerName,
);

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

export const getOpenAIMessageHistory = async (
  conversationId: string,
): Promise<OpenAIMessage[]> => {
  // const jsonString = JSON.stringify(jsonData);
  // To check container is exist or not. If not exist then create it.
  await containerClient.createIfNotExists();

  // Get a block blob client pointing to the blob
  const blockBlobClient = containerClient.getBlockBlobClient(conversationId);
  let retVal: OpenAIMessage[] = [];

  if (blockBlobClient.exists()) {
    const download:string|Buffer = await (await blockBlobClient.download()).readableStreamBody.read()
    retVal = JSON.parse(download as string) 
    return retVal;
  }
  
  const uploadPayload = JSON.stringify(retVal);
  await blockBlobClient.upload(uploadPayload, Buffer.byteLength(uploadPayload));
  return retVal;
};

export const putOpenAIMessageHistory = async (
  conversationId: string,messageHistory:OpenAIMessage[]
): Promise<OpenAIMessage[]> => {
  // const jsonString = JSON.stringify(jsonData);
  // To check container is exist or not. If not exist then create it.
  await containerClient.createIfNotExists();

  // Get a block blob client pointing to the blob
  const blockBlobClient = containerClient.getBlockBlobClient(conversationId);

  const uploadPayload = JSON.stringify(messageHistory);
  await blockBlobClient.upload(uploadPayload, Buffer.byteLength(uploadPayload));
  return messageHistory;
};

export const getOpenAIReply = async (
  text: string,
  messagesHistory: OpenAIMessage[],
): Promise<string> => {
  // let openAiJson = {
  //   messages: [

  //   ],
  //   temperature: 0,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,
  //   max_tokens: 800,
  //   stop: null,
  //   azureSearchEndpoint: azureSearchEndpoint,
  //   azureSearchKey: azureSearchKey,
  //   azureSearchIndexName: azureSearchIndexName,
  // };
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: azureOpenAISystemRole,
    },
    ...messagesHistory,
  ];

  const events = openAIclient.listChatCompletions(
    azureSearchDeploymentId,
    messages,
    {
      maxTokens: 800,
      /**
       * The `azureExtensionOptions` property is used to configure the
       * Azure-specific extensions. In this case, we are using the
       * Azure Cognitive Search extension with a vector index to provide
       * the model with additional context.
       */
      azureExtensionOptions: {
        extensions: [
          {
            type: 'AzureCognitiveSearch',
            endpoint: azureSearchEndpoint,
            key: azureSearchKey,
            indexName: azureSearchIndexName,
          },
        ],
      },
    },
  );

  for await (const event of events) {
    for (const choice of event.choices) {
      console.log(choice.delta?.content);
      return choice.message.content;
    }
  }

  // const retOpenAI = fetch(
  //   `https://whatsapp-chat.openai.azure.com/openai/deployments/whatsapp-chat/extensions/chat/completions?api-version=2023-07-01-preview`,

  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${whatsapp_token}`,
  //     },
  //     body: JSON.stringify(openAiJson),
  //   },
  // );

  return '';
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
    text: { body: `hello, ${reply_message}` },
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
    if (reqVal.entry instanceof Array)
      for (const entry of reqVal?.entry) {
        if (entry?.changes instanceof Array)
          for (const change of entry?.changes) {
            if (change?.value?.messages instanceof Array) {
              for (const msg of change?.value?.messages) {
                if (msg?.text?.body) {
                  const ret2 = await sendReply(
                    change.value.metadata.phone_number_id,
                    whatsappToken,
                    msg.from,
                    msg.text.body,
                  );
                  context.log(
                    `got ${ret2.status}-  ${JSON.stringify(
                      ret2.headers,
                    )}; ${await ret2.text()}`,
                  );
                }
              }
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
