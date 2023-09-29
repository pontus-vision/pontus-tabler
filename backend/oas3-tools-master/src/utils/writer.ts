export interface ResponsePayload {
  code: number;
  payload: string;
}

export const respondWithCode = (
  code: number,
  payload: string
): ResponsePayload => {
  return { code, payload } as ResponsePayload;
};

export const writeJson = (
  response,
  arg1: any | ResponsePayload,
  arg2?: any
) => {
  var code;
  var payload;

  if (arg1 && arg1.code && arg1.payload) {
    writeJson(response, arg1?.payload, arg1?.code);
    return;
  }

  if (arg2 && Number.isInteger(arg2)) {
    code = arg2;
  } else {
    if (arg1 && Number.isInteger(arg1)) {
      code = arg1;
    }
  }
  if (code && arg1) {
    payload = arg1;
  } else if (arg1) {
    payload = arg1;
  }

  if (!code) {
    // if no response code given, we default to 200
    code = 200;
  }
  if (typeof payload === "object") {
    payload = JSON.stringify(payload, null, 2);
  }
  response.writeHead(code, { "Content-Type": "application/json" });
  response.end(payload);
};
