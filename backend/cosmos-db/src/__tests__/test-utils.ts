import { HttpRequest, InvocationContext } from '@azure/functions';
import httpTrigger from '../server';

export const post = async (
  endpoint: string,
  body: any,
  headers: any = {},
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

//  const res = await fetch(
//    'http://localhost:8080/PontusTest/1.0.0/' + endpoint,
//    {
//      method: 'POST',
//      headers: {
//        'Content-Type': 'application/json',
//        Authorization:  headers['Authorization'] || 'Bearer 123456',
//      },
//      body: JSON.stringify(body),
//    },
//  )
//  const json = await res.json()

  const res = await httpTrigger(
    new HttpRequest({
      body: { string: JSON.stringify(body) },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
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

export const stateObj = {
  global: {},
  borders: [],
  layout: {
    type: 'row',
    id: '#feb1a503-c279-4b46-ac7a-fcf5b9fab21b',
    children: [
      {
        type: 'row',
        id: '#620f741f-bda6-4b7e-8b7e-a1acff536074',
        children: [
          {
            type: 'row',
            id: '#ec6e969d-c644-45bd-90d8-3eace546c740',
            children: [
              {
                type: 'tabset',
                id: '#7d9b8dac-c630-4951-a361-5fd4c6aad819',
                weight: 25,
                children: [
                  {
                    type: 'tab',
                    id: '#ea105f05-0c99-4bbe-9250-69bf95d6f0cd',
                    name: 'PVDoughnutChart2',
                    component: 'PVDoughnutChart2',
                    config: {
                      lastState: [],
                    },
                  },
                ],
              },
              {
                type: 'tabset',
                id: '#5f3cf570-09d3-408e-aea1-40ad8032ec14',
                weight: 12.5,
                children: [
                  {
                    type: 'tab',
                    id: '#f635c412-a518-455a-aa73-60af06738973',
                    name: 'PVDoughnutChart2',
                    component: 'PVDoughnutChart2',
                    config: {
                      lastState: [],
                    },
                  },
                  {
                    type: 'tab',
                    id: '#c1a28f54-5115-4da0-b921-95e9d33f75a0',
                    name: 'PVDoughnutChart2',
                    component: 'PVDoughnutChart2',
                    config: {
                      lastState: [],
                    },
                  },
                ],
                active: true,
              },
              {
                type: 'tabset',
                id: '#ab280769-eb6c-4fb8-bc2b-6c6870b2aaab',
                weight: 50,
                children: [
                  {
                    type: 'tab',
                    id: '#0f02f1df-c6e6-4ba3-b3c6-4592ec48df32',
                    name: 'PVDoughnutChart2',
                    component: 'PVDoughnutChart2',
                    config: {
                      lastState: [],
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'tabset',
            id: '#eb59c59b-7dd4-40bf-b36c-cb560a10d338',
            children: [
              {
                type: 'tab',
                id: '#13d25b84-3218-4976-bb24-4a7e7c1ccf6e',
                name: 'PVDoughnutChart2',
                component: 'PVDoughnutChart2',
                config: {
                  lastState: [],
                },
              },
            ],
          },
        ],
      },
    ],
  },
};
