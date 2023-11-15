import { HttpRequest, InvocationContext } from '@azure/functions';
import httpTrigger from '..';

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
  console.log(`Ret val is ${JSON.stringify(retVal)}`);
  return retVal;
};
