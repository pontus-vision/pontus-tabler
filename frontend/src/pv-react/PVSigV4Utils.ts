import CryptoJS from 'crypto-js';
import { URL } from 'url';
import { AxiosRequestConfig, Method } from 'axios';

export const AWS_SHA_256 = 'AWS4-HMAC-SHA256';
export const AWS4_REQUEST = 'aws4_request';
export const AWS4 = 'AWS4';
export const X_AMZ_DATE = 'x-amz-date';
export const X_AMZ_SECURITY_TOKEN = 'x-amz-security-token';
export const HOST = 'host';
export const AUTHORIZATION = 'Authorization';
export const TR_REGION = 'eu-west-2';
export const TR_SERVICE = 'execute-api';

export interface PVSigV4HttpRequest extends AxiosRequestConfig {
  creds: Credentials | string;
}

export interface Credentials {
  SecretAccessKey: string;
  AccessKeyId: string;
  SessionToken?: string;
}

export class PVSigV4Utils {
  static getRequestConfig = (creds: Credentials, config: AxiosRequestConfig): AxiosRequestConfig => {
    // const creds = await PVSigV4Utils.getAwsCreds();

    const req: PVSigV4HttpRequest = {
      ...config,
      creds: creds!,
    };
    PVSigV4Utils.setHeaders(req);

    return req as AxiosRequestConfig;
  };

  static setHeaders(req: PVSigV4HttpRequest): void {
    if (typeof req.creds === 'string') {
      const buff = Buffer.from(req.creds, 'base64');
      req.creds = JSON.parse(buff.toString('utf8')) as Credentials;
    }
    const creds = req.creds as Credentials;

    const url: URL = new URL(req.url!);
    const datetime = new Date()
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z')
      .replace(/[:\-]|\.\d{3}/g, '');

    const headers = req.headers;
    headers[X_AMZ_DATE] = datetime;
    headers[HOST] = url.hostname;

    const canonicalRequest = PVSigV4Utils.buildCanonicalRequest(
      req.method!,
      url.pathname,
      {},
      headers,
      JSON.stringify(req.data)
    );

    const hashedCanonicalRequest = PVSigV4Utils.hashCanonicalRequest(canonicalRequest);
    const credentialScope = PVSigV4Utils.buildCredentialScope(datetime, TR_REGION, TR_SERVICE);
    const stringToSign = PVSigV4Utils.buildStringToSign(datetime, credentialScope, hashedCanonicalRequest);
    const signingKey = PVSigV4Utils.calculateSigningKey(creds.SecretAccessKey, datetime, TR_REGION, TR_SERVICE);
    const signature = PVSigV4Utils.calculateSignature(signingKey, stringToSign);
    headers[AUTHORIZATION] = PVSigV4Utils.buildAuthorizationHeader(
      creds.AccessKeyId,
      credentialScope,
      headers,
      signature
    );
    if (creds.SessionToken !== '') {
      headers[X_AMZ_SECURITY_TOKEN] = creds.SessionToken;
    }
    delete headers[HOST];
    req.headers = headers;
  }

  static hash(value: string): CryptoJS.lib.WordArray {
    return CryptoJS.SHA256(value);
  }

  static hexEncode(value: CryptoJS.lib.WordArray): string {
    return value.toString(CryptoJS.enc.Hex);
  }

  static hmac(secret: CryptoJS.lib.WordArray | string, value: CryptoJS.lib.WordArray | string): CryptoJS.lib.WordArray {
    return CryptoJS.HmacSHA256(value, secret);
  }

  static buildCanonicalRequest(
    method: Method,
    path: string,
    queryParams: Record<string, string>,
    headers: Record<string, any>,
    payload: string
  ): string {
    return (
      method +
      '\n' +
      PVSigV4Utils.buildCanonicalUri(path) +
      '\n' +
      PVSigV4Utils.buildCanonicalQueryString(queryParams) +
      '\n' +
      PVSigV4Utils.buildCanonicalHeaders(headers) +
      '\n' +
      PVSigV4Utils.buildCanonicalSignedHeaders(headers) +
      '\n' +
      PVSigV4Utils.hexEncode(PVSigV4Utils.hash(payload))
    );
  }

  static hashCanonicalRequest(request: string): string {
    return PVSigV4Utils.hexEncode(PVSigV4Utils.hash(request));
  }

  static buildCanonicalUri(uri: string): string {
    return encodeURI(uri);
  }

  static buildCanonicalQueryString(queryParams: Record<string, string>) {
    if (Object.keys(queryParams).length < 1) {
      return '';
    }
    const sortedQueryParams = [];
    for (const property in queryParams) {
      if (queryParams.hasOwnProperty(property)) {
        sortedQueryParams.push(property);
      }
    }
    sortedQueryParams.sort();

    let canonicalQueryString = '';
    for (let i = 0; i < sortedQueryParams.length; i++) {
      canonicalQueryString +=
        sortedQueryParams[i] + '=' + PVSigV4Utils.fixedEncodeURIComponent(queryParams[sortedQueryParams[i]]) + '&';
    }
    return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
  }

  static fixedEncodeURIComponent(str: string) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  static buildCanonicalHeaders(headers: Record<string, any>) {
    let canonicalHeaders = '';
    const sortedKeys = [];
    for (const property in headers) {
      if (headers.hasOwnProperty(property)) {
        sortedKeys.push(property);
      }
    }
    sortedKeys.sort();

    for (let i = 0; i < sortedKeys.length; i++) {
      canonicalHeaders += sortedKeys[i].toLowerCase() + ':' + headers[sortedKeys[i]] + '\n';
    }
    return canonicalHeaders;
  }

  static buildCanonicalSignedHeaders(headers: Record<string, any>): string {
    const sortedKeys = [];
    for (const property in headers) {
      if (headers.hasOwnProperty(property)) {
        sortedKeys.push(property.toLowerCase());
      }
    }
    sortedKeys.sort();

    return sortedKeys.join(';');
  }

  static buildStringToSign(datetime: string, credentialScope: string, hashedCanonicalRequest: string) {
    return AWS_SHA_256 + '\n' + datetime + '\n' + credentialScope + '\n' + hashedCanonicalRequest;
  }

  static buildCredentialScope(datetime: string, region: string, service: string): string {
    return datetime.substr(0, 8) + '/' + region + '/' + service + '/' + AWS4_REQUEST;
  }

  static calculateSigningKey(secretKey: string, datetime: string, region: string, service: string) {
    return PVSigV4Utils.hmac(
      PVSigV4Utils.hmac(PVSigV4Utils.hmac(PVSigV4Utils.hmac(AWS4 + secretKey, datetime.substr(0, 8)), region), service),
      AWS4_REQUEST
    );
  }

  static calculateSignature(key: CryptoJS.lib.WordArray, stringToSign: string) {
    return PVSigV4Utils.hexEncode(PVSigV4Utils.hmac(key, stringToSign));
  }

  static buildAuthorizationHeader(
    accessKey: string,
    credentialScope: string,
    headers: Record<string, any>,
    signature: string
  ) {
    return (
      AWS_SHA_256 +
      ' Credential=' +
      accessKey +
      '/' +
      credentialScope +
      ', SignedHeaders=' +
      PVSigV4Utils.buildCanonicalSignedHeaders(headers) +
      ', Signature=' +
      signature
    );
  }
}
