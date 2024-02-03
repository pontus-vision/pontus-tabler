import { HttpRequest, InvocationContext } from '@azure/functions';
import httpTrigger from '../server';

export const post = async (
  endpoint: string,
  body: any,
): Promise<{ data: any; status: number }> => {
  // return sendHttpRequest(
  //   'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
  //   {
  //     'Content-Type': 'application/json',
  //     Authorization: 'Bearer 123456',
  //   },
  //   {},
  //   JSON.stringify(body),
  // );

  //   const res = await axios.post(
  //     'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
  //     body,
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer 123456',
  //       },
  //     },
  //   );
  //   return res;

  // const res = await fetch(
  //   'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: 'Bearer 123456',
  //     },
  //     body: JSON.stringify(body),
  //   },
  // );

  const res = await httpTrigger(
    new HttpRequest({
      body: { string: JSON.stringify(body) },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 123456',
      },
      url: 'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
    }),
    new InvocationContext(),
  );

  const retVal = {
    status: res.status,
    data: typeof res.body === 'string' ? JSON.parse(res.body) : res.body,
  };
  return retVal;
};

export const isSubset = (obj1, obj2) => {
  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      if (obj1[key].length !== obj2[key].length) {
        return false;
      }
      for (let i = 0; i < obj1[key].length; i++) {
        if (
          typeof obj1[key][i] === 'object' &&
          typeof obj2[key][i] === 'object'
        ) {
          if (!isSubset(obj1[key][i], obj2[key][i])) {
            return false;
          }
        } else if (obj1[key][i] !== obj2[key][i]) {
          return false;
        }
      }
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (!isSubset(obj1[key], obj2[key])) {
        return false;
      }
    } else if (obj2[key] !== obj1[key]) {
      return false;
    }
  }
  return true;
};
