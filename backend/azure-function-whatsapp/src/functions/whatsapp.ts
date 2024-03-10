import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
// import { crypto } from 'crypto';
import * as crypto from 'crypto';
import { OpenAIMessage, Property, RoleType, WhatsappWebHook } from './types';
import {
  OpenAIClient,
  AzureKeyCredential,
  ChatCompletions,
  ChatRequestMessage,
  GetChatCompletionsOptions,
  ChatCompletionsFunctionToolDefinition,
  FunctionCall,
  ChatCompletionsFunctionToolCall,
  ChatRequestToolMessage,
  ChatResponseMessage,
  ChatRole,
  ChatRequestAssistantMessage,
} from '@azure/openai';

import OpenAI, { toFile } from 'openai';
import { DefaultAzureCredential } from '@azure/identity';

import { BlobServiceClient } from '@azure/storage-blob';
import { getDistance } from './geolocation';
import { features } from 'process';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

const hubVerifyToken = process.env.HUB_VERIFY_TOKEN || 'test';
const hubVerifySha = process.env.HUB_VERIFY_SHA || 'sha256';
const whatsappToken = process.env.WHATSAPP_TOKEN;

const azureEndpoint =
  process.env['ENDPOINT'] || 'https://whatsapp-chat.openai.azure.com/';
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
  process.env['AZURE_SEARCH_DEPLOYMENT_ID'] || 'whatsapp-chat';
const azureOpenAISystemRole =
  process.env['AZURE_OPENAI_SYSTEM_ROLE'] ||
  `You are an AI estate agent that helps people find information about new property builds (primary market) in Brazil. 
You must only provide information about properties built by Exto Incorporação e Construção by calling the tools defined.
You must summarise the details of each property in a format suitable for a whatsapp chat.`;

// You must only use content from the following sites:
// GERAL
// https://linktr.ee/exto_incorporadora
// EXCELLENCE PERDIZES
// https://linktr.ee/excellenceperdizes
// LEDGE BROOKLIN
// https://linktr.ee/Ledge_Brooklin
// TERRARO VILA ROMANA
// https://linktr.ee/Terraro_Vila_Romana
// BLUE HOME RESORT
// https://linktr.ee/Blue_Home_Resort_Jockey
// LAMP PERDIZES
// https://linktr.ee/LAMP_Perdizes
// ONLY CIDADE JARDIM
// https://linktr.ee/Only_Cidade_Jardim
// UPPER EAST PERDIZES
// https://linktr.ee/Upper_East_Perdizes
// UPPER WEST PERDIZES
// https://linktr.ee/Upper_West_Perdizes
// MONDO MORUMBI
// https://linktr.ee/Mondo_Morumbi
// PROVENANCE MORUMBI
// https://linktr.ee/Provenance_Morumbi
// SINTONIA PERDIZES
// https://linktr.ee/Sintonia_Perdizes
// ESSÊNCIA DA VILA
// https://linktr.ee/Essencia_da_Vila
// INSPIRE IBIRAPUERA
// https://linktr.ee/Inspire_Ibirapuera
// PARC DEVANT PERDIZES
// https://linktr.ee/Parc_Devant_Perdizes
// CONVERGE
// https://linktr.ee/Converge_Vila_Romana
// `;

const azureBlobConnectionString =
  process.env['AZURE_BLOB_CONNECTION_STRING'] ||
  'https://pvhomewhatsapp8fc1.blob.core.windows.net';
const azureBlobContainerName =
  process.env['AZURE_BLOB_CONTAINER_NAME'] || 'whatsapp-chat';

const openAISettings: GetChatCompletionsOptions = {
  maxTokens: 900,
  temperature: 0.7,
  topP: 0.95,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stop: null,

  /**
   * The `azureExtensionOptions` property is used to configure the
   * Azure-specific extensions. In this case, we are using the
   * Azure Cognitive Search extension with a vector index to provide
   * the model with additional context.
   */
  // azureExtensionOptions: {

  //   extensions: [
  //     {
  //       type: 'AzureCognitiveSearch',
  //       endpoint: azureSearchEndpoint,
  //       key: azureSearchKey,
  //       indexName: azureSearchIndexName,
  //     },
  //   ],
  // },
};
export interface Location {
  latitude: number;
  longitude: number;
  radiusInMeters?: number;
}

const getBuildingCompaniesInLocation = async (
  location: Location,
  context: InvocationContext,
): Promise<string> => {
  context.log(
    `in getBuildingCompaniesInLocation() => location = ${JSON.stringify(
      location,
    )}`,
  );
  return location.latitude < 0 && location.longitude < 0
    ? 'Exto Incorporação e Construção'
    : 'not available';
};

const squareFeetPerSquareMeter = 10.7639;
import { sampleProperties } from './sample-properties';

const resetHistory = async (
  to: string,
  messages: ChatRequestMessage[],
  context: InvocationContext,
): Promise<string> => {
  messages.length = 0;
  context.log(`resetting chat history for ${to}`);
  await containerClient.createIfNotExists();

  putOpenAIMessageHistory(to, []);
  return `resetting chat history for ${to}`;
};

const normalizePropId = (propId:string): string => {
  return propId?.toLocaleLowerCase()?.replace(/ /g,"_")?.replace(/-/g,"_");
}
const getPropertiesNearLocation = async (
  location: Location,
  context: InvocationContext,
): Promise<string> => {
  context.log(
    `in getPropertiesNearLocation() => location = ${JSON.stringify(location)}`,
  );

  const retVal: Record<string,Property> = {}
  


  // const propertiesByDistance = sampleProperties.sort((a, b) => {
  //   a.distance = getDistance(
  //     location.latitude,
  //     location.longitude,
  //     a.latitude,
  //     a.longitude,
  //   );

  //   b.distance = getDistance(
  //     location.latitude,
  //     location.longitude,
  //     b.latitude,
  //     b.longitude,
  //   );
  //   return a.distance - b.distance;
  // });

  for (const prop in sampleProperties) {

    const property: Property = sampleProperties[prop];
    property.distance = getDistance(location.latitude, location.longitude,property.latitude, property.longitude);
    if (property.distance < 15000){
      retVal[normalizePropId(prop)] = {
        ...property,
        descripton: undefined,
        distance: undefined
      }
    }

  } 


  context.log(`properties within 10K: ${JSON.stringify(retVal)}`);

  return JSON.stringify(retVal);
};

export interface IdObj {
  key: string;
}

const getDetailedInformation = async (
  data: IdObj,
  context: InvocationContext,
): Promise<string> => {
  const propId = normalizePropId(data.key)
  context.log(`in getDetailedInformation() => id = ${data.key}, normalised to ${propId}`);

  const res = sampleProperties[propId] || "No details found; please contact the construction company directly.";
  return JSON.stringify(res);
};

type FunctionTypes =
  | typeof getBuildingCompaniesInLocation
  | typeof getPropertiesNearLocation
  | typeof getDetailedInformation;

type FuncResetHistoryType = typeof resetHistory;

type ToolType = {
  metadata: ChatCompletionsFunctionToolDefinition;
  func: FunctionTypes | FuncResetHistoryType;
};

const toolsMap: Record<string, ToolType> = {
  getDetailedInformation: {
    func: getDetailedInformation,
    metadata: {
      type: 'function',
      function: {
        name: 'getDetailedInformation',
        description:
          'Get detailed information for a property by key in a JSON map [properties]',
        parameters: {
          type: 'object',
          descrition:
            'The key of the [properties] JSON map to get details for',
          properties: {
            key: {
              type: 'string',
            },
          },
          required: ['key'],
        },
      },
    },
  },
  getPropertiesNearLocation: {
    func: getPropertiesNearLocation,
    metadata: {
      type: 'function',
      function: {
        name: 'getPropertiesNearLocation',
        description:
          '[properties]: Lists properties in an area in a JSON map { "id1": {  "short_description": string, "url": string, "address": string }, "id2": {...}}  use the key returned here to get more information by calling getDetailedInformation()',
        parameters: {
          type: 'object',
          descrition:
            'The area as latitude, logitude, and radius in meters e.g. { "latitude": -23.6110,  "longitude": -46.6934, "radiusInMeters": 10000}',
          properties: {
            latitude: {
              type: 'number',
              minimum: -90,
              maximum: 90,
            },
            longitude: {
              type: 'number',
              minimum: -180,
              maximum: 180,
            },
            radiusInMeters: {
              type: 'integer',
              minimum: 1000,
              maximum: 100000,
              multipleOf: 1000,
            },
          },
          required: ['latitude', 'longitude', 'radiusInMeters'],
        },
      },
    },
  },

  // getBuildingCompaniesInLocation: {
  //   func: getBuildingCompaniesInLocation,
  //   metadata: {
  //     type: 'function',
  //     function: {
  //       name: 'getBuildingCompaniesInLocation',
  //       description: 'Lists property development companies in a given location',
  //       parameters: {
  //         type: 'object',
  //         descrition:
  //           'The location as latitude and logitude, e.g. { "latitude": -23.6110,  "longitude": -46.6934}',
  //         properties: {
  //           latitude: {
  //             type: 'number',
  //             minimum: -90,
  //             maximum: 90,
  //           },
  //           longitude: {
  //             type: 'number',
  //             minimum: -180,
  //             maximum: 180,
  //           },
  //         },
  //         required: ['latitude', 'longitude'],
  //       },
  //     },
  //   },
  // },
  resetHistory: {
    func: resetHistory,
    metadata: {
      type: 'function',
      function: {
        name: 'resetHistory',
        description: 'resets the chat history, restarts the chat',
        parameters: {
          type: 'object',
          description: 'No parameters',
          properties: {},
        },
      },
    },
  },
};

const tools: ChatCompletionsFunctionToolDefinition[] = Object.entries(
  toolsMap,
).map(([key, value]) => value.metadata);
const blobServiceClient = new BlobServiceClient(
  azureBlobConnectionString,
  new DefaultAzureCredential(),
);

const openAIclient = new OpenAIClient(
  azureEndpoint,
  new DefaultAzureCredential(),
);

// const blobServiceClient = BlobServiceClient.fromConnectionString(
//   azureBlobConnectionString,
// );
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

export const getBlobNameFromConversationId = (
  conversationId: string,
): string => {
  return `${conversationId}.json`;
};

export const getOpenAIMessageHistory = async (
  conversationId: string,
): Promise<ChatRequestMessage[] | ThreadCreateParams.Message[]> => {
  // const jsonString = JSON.stringify(jsonData);
  // To check container is exist or not. If not exist then create it.

  await containerClient.createIfNotExists();

  // Get a block blob client pointing to the blob
  const blockBlobClient = containerClient.getBlockBlobClient(
    getBlobNameFromConversationId(conversationId),
  );
  let retVal: ChatRequestMessage[] = [];

  try {
    if (blockBlobClient.exists()) {
      const download = await blockBlobClient.downloadToBuffer();
      retVal = JSON.parse(download.toString());

      return retVal.filter((obj) => Object.keys(obj).length > 0);
    }
  } catch (error) {
    const uploadPayload = JSON.stringify(retVal);
    await blockBlobClient.upload(
      uploadPayload,
      Buffer.byteLength(uploadPayload),
    );
  }
  return retVal.filter((obj) => Object.keys(obj).length > 0);
};

export const putOpenAIMessageHistory = async (
  conversationId: string,
  messageHistory: ChatRequestMessage[],
): Promise<ChatRequestMessage[]> => {
  // const jsonString = JSON.stringify(jsonData);
  // To check container is exist or not. If not exist then create it.
  await containerClient.createIfNotExists();

  // Get a block blob client pointing to the blob
  const blockBlobClient = containerClient.getBlockBlobClient(
    getBlobNameFromConversationId(conversationId),
  );

  const uploadPayload = JSON.stringify(messageHistory);
  await blockBlobClient.upload(uploadPayload, Buffer.byteLength(uploadPayload));
  return messageHistory;
};

export const removeEarlierMessages = (
  messages: ChatRequestMessage[],
): ChatRequestMessage[] => {
  return messages.filter((val, index) => index !== 1);
};

export const processOpenAIToolCalls = async (
  to: string,
  toolCalls: ChatCompletionsFunctionToolCall[],
  reqMessage: ChatResponseMessage,
  messagesHistory: ChatRequestMessage[],
  context: InvocationContext,
): Promise<void> => {
  // context.log(`function call = ${JSON.stringify(toolCalls)}`);
  let messages: ChatRequestMessage[] = [
    {
      role: 'system',
      content: azureOpenAISystemRole,
    },
    ...messagesHistory.slice(-10),
    {
      // toolCallId: toolCall.id,
      // name: toolCall.function.name,
      role: 'assistant',
      content: reqMessage?.content,
      toolCalls: toolCalls,
    } as ChatRequestAssistantMessage,
  ];
  let calledResetHistory = false;
  for (const toolCall of toolCalls) {
    context.log(
      `in processOpenAIToolCalls() - Processing ${JSON.stringify(toolCall)} `,
    );
    const funcName = toolCall?.function?.name;
    const func = toolsMap[funcName]?.func;
    if (func) {
      let retVal = '';
      if (funcName === 'resetHistory') {
        resetHistory(to, messages, context);
        calledResetHistory = true;
        retVal = "I've reset our chat history";
        messages.push(
          {
            role: 'system',
            content: azureOpenAISystemRole,
          },
          {
            // toolCallId: toolCall.id,
            // name: toolCall.function.name,
            role: 'assistant',
            content: reqMessage?.content,
            toolCalls: toolCalls,
          } as ChatRequestAssistantMessage,
        );
      } else {
        retVal = await (func as FunctionTypes)(
          JSON.parse(toolCall.function.arguments),
          context,
        );
      }
      messages.push({
        content: retVal,
        role: 'tool',
        toolCallId: toolCall.id,
      });
    }
  }
  context.log(
    `in processOpenAIToolCalls() - before calling getChatCompletions() `,
  );

  if (!calledResetHistory) {
    for (let index = 0; index < 5; index++) {
      try {
        const events = await openAIclient.getChatCompletions(
          azureSearchDeploymentId,
          messages,
          openAISettings,
        );

        context.log(
          `in processOpenAIToolCalls() - got event ${JSON.stringify(events)}`,
        );
        for (const choice of events.choices) {
          context.log(
            `in processOpenAIToolCalls() - delta content = ${choice?.delta?.content}`,
          );
          context.log(
            `in processOpenAIToolCalls() - message content = ${choice?.message?.content}`,
          );
          messagesHistory.push({
            name: undefined,
            content: choice?.message?.content,
            role: choice?.message?.role as RoleType,
          });
        }
        break;
      } catch (e) {
        context.error(e);
        if (e.code === 'context_length_exceeded') {
          messages = removeEarlierMessages(messages);
          continue;
        }
        throw e;
      }
    }
  }
};

// import * as fs from 'node:fs';
import {
  Assistant,
  AssistantCreateParams,
  AssistantListParams,
} from 'openai/resources/beta/assistants/assistants';
import {
  Thread,
  ThreadCreateParams,
} from 'openai/resources/beta/threads/threads';
import { Messages } from 'openai/resources/beta/threads/messages/messages';
import { sleep } from 'openai/core';

const openai = new OpenAI();

let assistant: Assistant = undefined;
export const stringToArrayBuffer = (str: string): ArrayBuffer => {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
};

export const getOrCreateAssistant = async (): Promise<Assistant> => {
  if (!assistant) {
    const openAIDirectSettings: AssistantCreateParams = {
      model: 'gpt-3.5-turbo-0125',
      instructions: azureOpenAISystemRole,
      tools: [{ type: 'retrieval' }],
      name: 'PVHOME',
      description: 'Estate Agent Assistant',
    };

    const listParams: AssistantListParams = {
      limit: 100,
      order: 'desc',
    };

    do {
      const res = await openai.beta.assistants.list(listParams);

      const items = res.getPaginatedItems();
      for (const item of items) {
        if (
          item.description === openAIDirectSettings.description &&
          item.instructions === openAIDirectSettings.instructions &&
          item.model === openAIDirectSettings.model &&
          item.name === openAIDirectSettings.name
        ) {
          assistant = item;
          break;
        }
        listParams.before = item.id;
      }
      if (!assistant && !res.hasNextPage()) {
        const samplPropertiesStr = JSON.stringify(sampleProperties);

        const filePromise = openai.files.create({
          file: await toFile(
            stringToArrayBuffer(samplPropertiesStr),
            'properties.json',
          ),
          purpose: 'assistants',
        });
        assistant = await openai.beta.assistants.create({
          ...openAIDirectSettings,
          file_ids: [(await filePromise).id],
        });
      }
    } while (!assistant);
  }
  return assistant;
};

let threadIdsMap: Record<string, string> = undefined;

export const upsertThreadIdsMap = async (
  context: InvocationContext,
  threadIds?: Record<string, string>,
  override: boolean = false,
): Promise<Record<string, string>> => {
  const blockBlobClient = containerClient.getBlockBlobClient('thread_ids.json');
  try {
    if (blockBlobClient.exists()) {
      context.debug(`in upsertThreadIdsMap() - blob client exists`);
      const download = await blockBlobClient.downloadToBuffer();
      const currThreadIds: Record<string, string> = JSON.parse(
        download.toString(),
      );
      context.debug(
        `in upsertThreadIdsMap() - blob client exists - found ${JSON.stringify(
          currThreadIds,
        )}`,
      );

      if (!threadIds) {
        threadIds = currThreadIds;
        return threadIds;
      } else {
        const consolidatedThreadIds = override
          ? threadIds
          : { ...currThreadIds, ...threadIds };

        context.debug(
          `in upsertThreadIdsMap() - blob client exists - consolidatedThreadIds = ${JSON.stringify(
            consolidatedThreadIds,
          )}`,
        );

        const uploadPayload = JSON.stringify(consolidatedThreadIds);
        await blockBlobClient.upload(
          uploadPayload,
          Buffer.byteLength(uploadPayload),
        );
        return consolidatedThreadIds;
      }
    } else {
      context.debug(`in upsertThreadIdsMap() - blob client does not exist`);

      const threadIdsRet = threadIds || {};
      const uploadPayload = JSON.stringify(threadIdsRet);
      context.debug(
        `in upsertThreadIdsMap() - blob client does not exist - uploading ${uploadPayload}`,
      );

      await blockBlobClient.upload(
        uploadPayload,
        Buffer.byteLength(uploadPayload),
      );
      return threadIdsRet;
    }
  } catch (error) {
    context.debug(
      `in upsertThreadIdsMap() - got an error  ${JSON.stringify(error)}`,
    );

    const threadIdsRet = threadIds || {};
    const uploadPayload = JSON.stringify(threadIdsRet);
    await blockBlobClient.upload(
      uploadPayload,
      Buffer.byteLength(uploadPayload),
    );
    return threadIdsRet;
  }
};

export const getOrCreateThread = async (
  to: string,
  messagesHistory: ChatRequestMessage[] | ChatCompletionMessageParam[],
  context: InvocationContext,
): Promise<Thread> => {
  if (!threadIdsMap) {
    threadIdsMap = await upsertThreadIdsMap(context);
  }

  context.debug(
    `in getOrCreateThread() - threadIdsMap = ${JSON.stringify(threadIdsMap)}`,
  );

  let threadId = threadIdsMap && threadIdsMap[to];

  context.debug(`in getOrCreateThread() - threadId = ${threadId}`);

  if (threadId) {
    const retVal = await openai.beta.threads.retrieve(threadId);
    context.debug(
      `in getOrCreateThread() - retrieved threadId = ${retVal.id}; created at ${retVal.created_at}`,
    );

    if (retVal) {
      return retVal;
    }
  }

  const messages = (messagesHistory as ChatCompletionMessageParam[])
    .filter((msg) => msg.role === 'user')
    .map(
      (val) =>
        ({
          role: 'user',
          content: val.content,
        } as ThreadCreateParams.Message),
    );
  const thread = await openai.beta.threads.create({
    messages,
  });
  context.debug(
    `in getOrCreateThread() - created threadId ${
      thread.id
    }; messages = ${JSON.stringify(messages)}`,
  );
  threadIdsMap[to] = thread.id;
  threadIdsMap = await upsertThreadIdsMap(context, threadIdsMap);

  return thread;
};

export const getOpenAIReplyDirect = async (
  to: string,
  text: string,
  messagesHistory: ChatRequestMessage[] | ChatCompletionMessageParam[],
  context: InvocationContext,
): Promise<ChatRequestMessage[] | ChatCompletionMessageParam[]> => {
  const messages = messagesHistory;

  await getOrCreateAssistant();

  context.debug(`in getOpenAIReplyDirect() - assistantId is ${assistant.id} `);

  const thrd = await getOrCreateThread(to, messagesHistory, context);
  context.debug(
    `in getOpenAIReplyDirect() - threadId is ${
      thrd.id
    }; threadIdMap = ${JSON.stringify(threadIdsMap)} `,
  );

  const message = await openai.beta.threads.messages.create(thrd.id, {
    role: 'user',
    content: text,
  });

  context.debug(
    `in getOpenAIReplyDirect() - threadId is ${thrd.id}; message.created_at = ${message.created_at} `,
  );

  messagesHistory.push({
    name: to,
    content: text,
    role: 'user',
  });

  let run = await openai.beta.threads.runs.create(thrd.id, {
    assistant_id: assistant.id,
  });

  context.debug(
    `in getOpenAIReplyDirect() - threadId is ${thrd.id}; run.id = ${run.id}; run.status = ${run.status} `,
  );

  let ready = false;

  do {
    run = await openai.beta.threads.runs.retrieve(thrd.id, run.id);
    ready = run.status !== 'queued' && run.status !== 'in_progress';
    context.debug(
      `in getOpenAIReplyDirect() - in wait loop; threadId is ${thrd.id}; run.id = ${run.id}; run.status = ${run.status} `,
    );
    await sleep(1000);
  } while (!ready);
  context.debug(
    `in getOpenAIReplyDirect() - after wait loop; threadId is ${thrd.id}; run.id = ${run.id}; run.status = ${run.status} `,
  );
  const retVal = [];
  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(thrd.id, {
      order: 'desc',
      limit: 1,
    });

    for (const msgs of messages.data) {
      for (const msg of msgs.content) {
        if (msg.type === 'text') {
          messagesHistory.push({
            name: to,
            content: msg.text.value,
            role: 'assistant',
          });
          retVal.push({
            name: to,
            content: msg.text.value,
            role: 'assistant',
          });
        }
      }
    }
  }

  return retVal;
};

export const getOpenAIReply = async (
  to: string,
  text: string,
  messagesHistory: ChatRequestMessage[],
  context: InvocationContext,
): Promise<ChatRequestMessage[]> => {
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
  messagesHistory.push({
    name: to,
    content: text,
    role: 'user',
  });

  const messages: ChatRequestMessage[] = [
    {
      role: 'system',
      content: azureOpenAISystemRole,
    },
    ...messagesHistory.slice(-10),
  ];

  const events = await openAIclient.getChatCompletions(
    azureSearchDeploymentId,
    messages,

    {
      ...openAISettings,
      tools,
    },
  );

  for (const choice of events.choices) {
    context.log(`delta content = ${choice?.delta?.content}`);
    context.log(`message content = ${choice?.message?.content}`);
    const toolCalls = choice?.message?.toolCalls;
    if (toolCalls && toolCalls.length > 0) {
      await processOpenAIToolCalls(
        to,
        toolCalls,
        choice?.message,
        messagesHistory,
        context,
      );
    } else {
      messagesHistory.push({
        name: undefined,
        content: choice?.message?.content,
        role: choice?.message?.role as RoleType,
      });
    }
  }

  return messagesHistory;

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

  // return '';
};

export const sendReply = async (
  phone_number_id: string,
  whatsapp_token: string,
  to: string,
  customerMessage: string,
  context: InvocationContext,
): Promise<Response> => {
  try {
    context.log(`in SendReply() attempting to get the message history`);
    const messageHistory = await getOpenAIMessageHistory(to);
    context.log(
      `in SendReply() message history is ${JSON.stringify(messageHistory)}`,
    );

    const replyMessage = await getOpenAIReply(
      to,
      customerMessage,
      messageHistory,
      context,
    );
    context.log(
      `in SendReply() reply Message is  ${JSON.stringify(replyMessage)}`,
    );

    await putOpenAIMessageHistory(to, messageHistory);
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
    if (replyMessage.length == messageHistory.length) {
      let json = {
        messaging_product: 'whatsapp',
        type: 'text',
        to: to,
        text: {
          body:
            replyMessage.length > 0
              ? replyMessage[replyMessage.length - 1].content
              : `Sorry, no data`,
        },
      };
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
    } else {
      let lastRet = undefined;
      for (const msg of replyMessage) {
        let json = {
          messaging_product: 'whatsapp',
          type: 'text',
          to: to,
          text: {
            body: replyMessage.length > 0 ? msg.content : `Sorry, no data`,
          },
        };
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

        lastRet = ret;
      }

      return lastRet;
    }
  } catch (e) {
    context.error(e);
    throw e;
  }
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
  // request.headers.forEach((val: String, key: string) =>
  //   context.log(`${key} = ${val}`),
  // );

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
                    context,
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
