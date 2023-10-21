/*
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import { create } from 'ssl-root-cas';

// Do this to attempt to fix the following issue:
// Error: UNABLE_TO_VERIFY_LEAF_SIGNATURE
// when calling https sites with root CAs that are missing intermediaries
// const rootCas = require('ssl-root-cas').create();

// default for all https requests
// (whether using https directly, request, or another module)
import { Agent as HttpAgent } from 'http';
// const HttpAgent = require('http').Agent;
import { Agent as HttpsAgent } from 'https';
// const HttpsAgent = require('https').Agent;
require('https').globalAgent.options.ca = create;

// `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
// and https requests, respectively, in node.js. This allows options to be added like
// `keepAlive` that are not enabled by default.

const httpAgent = new HttpAgent({ keepAlive: true, maxSockets: 5 });

const httpsAgent = new HttpsAgent({ keepAlive: true, maxSockets: 5 });

export const sendHttpRequest = async <T = any>(
  reqUrl: string,
  headers: Record<string, string>,
  queryParams: Record<string, string> = {},
  data: string | Buffer = '',
  method: Method = 'GET',
): Promise<AxiosResponse<T>> => {
  if (!reqUrl || reqUrl?.length === 0) {
    console.log(`Error: MUST SET THE URL; CANNOT FUNCTION WITH AN EMPTY URL`);
    process.exit(-1);
  }
  const maxRetries = Number.parseInt(`${process.env.PV_NUM_RETRIES || 5}`);
  const config: AxiosRequestConfig = {
    url: reqUrl,
    baseURL: reqUrl,
    headers: headers,
    params: queryParams,
    method: method,
    data: data,
    maxContentLength: 10000000,
    responseType: 'json',
    timeout: Number.parseInt(`${process.env.PV_TIMEOUT_MS || 2000}`),
    maxRedirects: Number.parseInt(`${process.env.PV_MAX_REDIRECTS || 5}`),
    httpAgent: httpAgent,
    httpsAgent: httpsAgent,
  };
  let resp: AxiosResponse<T> = {
    headers: {},
    request: {},
    data: {} as T,
    config: config,
    status: 500,
    statusText: 'ERROR',
  };
  if (process.env.PV_DEBUG) {
    console.log(
      `!!!! Sending ${method} request (${reqUrl}): \n${JSON.stringify(
        config.data,
      )}`,
    );
  }

  let lastErrorCode = 202;

  const instance = axios.create();

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(
        `############ Retry ${i}; Creating connection to URL ${reqUrl}; payload size = ${
          data?.length
        } eventHeaders = ${JSON.stringify(config.headers)}`,
      );

      let respPromise = instance.request(config);
      try {
        resp = await respPromise;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error(`###### Got an axios error: `);

          const errJson = err as AxiosError;
          console.error(
            `###### axios error status: ${errJson.response?.status} `,
          );
          console.error(`###### axios error code: ${errJson.code} `);

          resp = errJson.response! as AxiosResponse<T>;

          lastErrorCode = resp.status || 202;
          if (
            !((resp.status >= 300 && resp.status <= 399) || resp.status != 429)
          ) {
            throw err;
          }
        } else {
          throw err;
        }
      }

      if (process.env.PV_DEBUG) {
        console.log(
          `!!!! received reply code (${resp?.status}) \n${JSON.stringify(
            resp.headers,
          )}`,
        );
      }

      // const resp = await restClient.request(
      //   event.httpMethod,
      //   reqUrl,
      //   (event.body) ? event.body! : '', event.headers);

      const headers: Record<string, string> = {};
      const multiValueHeaders: Record<string, Array<string>> = {};

      if (resp.headers) {
        const localHeaders = resp.headers as Record<string, any>;
        for (const header in localHeaders) {
          if (localHeaders[header] && Array.isArray(localHeaders[header])) {
            multiValueHeaders[header] = localHeaders[header] as string[];
          } else {
            headers[header] = localHeaders[header] as unknown as string;
          }
        }
      }

      const retCode = resp.status;
      console.log(`################## got response code:${retCode}`);
      console.log(
        `################## got response headers:${JSON.stringify(headers)}`,
      );
      // const body = Buffer.from(resp.data, 'binary').toString('base64');
      // console.log(`################## got response :${body}`)

      return resp;
    } catch (err) {
      console.log(`error: ${(err as any).message}`);
      await new Promise((f) => setTimeout(f, 200 * i + 1));
    }
  }
  return resp;
};
*/

import axios from 'axios';

export const sendHttpRequest = async (
  reqUrl: string,
  headers: Record<string, string>,
  queryParams: Record<string, string> = {},
  data = '',
  method = 'POST',
) => {
  if (!reqUrl || reqUrl.length === 0) {
    throw new Error('MUST SET THE URL; CANNOT FUNCTION WITH AN EMPTY URL');
  }

  const maxRetries = parseInt(process.env.PV_NUM_RETRIES || '5');

  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = reqUrl + (queryString ? `?${queryString}` : '');

  const axiosInstance = axios.create({
    baseURL: fullUrl, // Set the base URL for all requests
    headers, // Set the request headers
    timeout: parseInt(process.env.PV_TIMEOUT_MS || '2000'), // Set a timeout for the request
  });

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(
        `############ Retry ${i}; Creating connection to URL ${fullUrl}; payload size = ${
          data.length
        } eventHeaders = ${JSON.stringify(headers)}`,
      );

      const response = await axiosInstance.request({
        url: fullUrl,
        method,
        data,
      });

      if (process.env.PV_DEBUG) {
        console.log(
          `!!!! received reply code (${response.status}) \n${JSON.stringify(
            response.headers,
          )}`,
        );
      }

      const retCode = response.status;
      console.log(`################## got response code:${retCode}`);
      console.log(
        `################## got response headers:${JSON.stringify(
          response.headers,
        )}`,
      );

      return response;
    } catch (error: any) {
      console.log(`error: ${JSON.stringify(error)}`);
      await new Promise((resolve) => setTimeout(resolve, 200 * i + 1));
    }
  }

  throw new Error('Max retries exceeded');
};
