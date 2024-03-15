import {
  DashboardDeleteReq,
  DashboardCreateReq,
  DashboardUpdateReq,
  ReadPaginationFilter,
  DashboardsReadRes,
  DashboardGroupAuthCreateReq,
  DashboardGroupAuthCreateRes,
  DashboardGroupAuthReadReq,
  DashboardGroupAuthReadRes,
  DashboardGroupAuthUpdateReq,
  DashboardGroupAuthUpdateRes,
  DashboardGroupAuthDeleteReq,
  DashboardGroupAuthDeleteRes,
} from '../typescript/api';
import { fetchContainer, fetchData, filterToQuery } from '../cosmos-utils';
import { NotFoundError } from '../generated/api';
import { ItemResponse, PatchOperation } from '@azure/cosmos';

const DASHBOARDS = 'dashboards';

export const upsertDashboard = async (
  data: DashboardCreateReq | DashboardUpdateReq,
) => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res = await dashboardContainer.items.upsert({
    ...data,
    authGroups: [],
  });
  const { _rid, _self, _etag, _attachments, _ts, ...rest } =
    res.resource as any;

  return rest;
};

export const readDashboardById = async (dashboardId: string) => {
  const querySpec = {
    query: 'select * from dashboards p where p.id=@dashboardId',
    parameters: [
      {
        name: '@dashboardId',
        value: dashboardId,
      },
    ],
  };
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const { resources } = await dashboardContainer.items
    .query(querySpec)
    .fetchAll();
  if (resources.length === 1) {
    return resources[0];
  } else if (resources.length === 0) {
    throw new NotFoundError('No dashboard found.');
  }
};

export const deleteDashboard = async (data: DashboardDeleteReq) => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);
  const res = await dashboardContainer.item(data.id, data.id).delete();

  return 'Dashboard deleted!';
};

export const readDashboards = async (
  body: ReadPaginationFilter,
): Promise<DashboardsReadRes> => {
  // if (Object.keys(body.filters).length === 0 && body.from === 1) {
  //   const dashboardContainer = await fetchContainer(DASHBOARDS);
  //   const res = await dashboardContainer.items
  //     .readAll({
  //       maxItemCount: body.to,
  //     })
  //     .fetchAll();

  //   return { dashboards: res.resources, totalDashboards: 1000 };
  // }
  const res = await fetchData(body, DASHBOARDS);

  return { dashboards: res.values, totalDashboards: res.count };
};

export const createDashboardAuthGroup = async (
  data: DashboardGroupAuthCreateReq,
): Promise<DashboardGroupAuthCreateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);
  const dashboardId = data.dashboardId;

  const res = await dashboardContainer.item(dashboardId, dashboardId).read();
  const authGroups = res.resource.authGroups;

  const patchArr: PatchOperation[] = [];

  for (const [index, el] of data.authGroups?.entries()) {
    patchArr.push({
      op: 'add',
      path: `/authGroups/-`,
      value: el,
    });
  }

  const res2 = await dashboardContainer
    .item(dashboardId, dashboardId)
    .patch(patchArr);

  return {
    authGroups: res2.resource.authGroups,
    dashboardId: res2.resource.id,
    dashboardName: res2.resource.name,
  };
};

export const readDashboardGroupAuth = async (
  data: DashboardGroupAuthReadReq,
): Promise<DashboardGroupAuthReadRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res3 = await dashboardContainer
    .item(data.dashboardId, data.dashboardId)
    .read();

  const str = filterToQuery({ filters: data.filters }, 'p');

  let query = `SELECT c.name, p.groupName, p.create, p.read, p["update"], p.delete, p.groupId FROM c JOIN p IN c.authGroups ${str}`;
  console.log({ query });
  const res = await dashboardContainer.items
    .query({
      query,
      parameters: [],
    })
    .fetchAll();

  if (res.resources.length === 0) {
    throw new NotFoundError('No group auth found.');
  }
  console.log({ res: res.resources });
  return {
    authGroups: res?.resources,
    dashboardId: data?.dashboardId,
    dashboardName: res?.resources[0]?.name,
  };
};

export const deleteDashboardGroupAuth = async (
  data: DashboardGroupAuthDeleteReq,
): Promise<DashboardGroupAuthDeleteRes> => {
  // checkFields(data.authGroups);

  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const dashboardId = data.dashboardId;

  const res3 = await dashboardContainer.item(dashboardId, dashboardId).read();

  const resource = res3.resource as DashboardGroupAuthReadRes;

  const resAuthGroups = resource.authGroups;

  const patchArr: PatchOperation[] = [];

  for (const [index, el] of data.authGroups.entries()) {
    const indexUpdate = resAuthGroups.findIndex((el2) => el2.groupId === el);

    patchArr.push({
      op: 'remove',
      path: `/authGroups/${indexUpdate}`,
    });
  }

  const res = await dashboardContainer
    .item(dashboardId, dashboardId)
    .patch(patchArr);

  return {
    authGroups: res.resource.authGroups,
    dashboardId: res.resource.id,
    dashboardName: res.resource.name,
  };
};

export const updateDashboardGroupAuth = async (
  data: DashboardGroupAuthUpdateReq,
): Promise<DashboardGroupAuthUpdateRes> => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const dashboardId = data.dashboardId;

  const res = (await dashboardContainer
    .item(dashboardId, dashboardId)
    .read()) as ItemResponse<DashboardGroupAuthReadRes>;

  const patchArr: PatchOperation[] = [];

  for (const group of data.authGroups) {
    const index = res.resource.authGroups.findIndex(
      (i) => i.groupId === group.groupId,
    );

    if (index === -1) {
      throw new NotFoundError(
        `No group (${group.groupName}) at id "${group.groupId}" found`,
      );
    }

    patchArr.push({
      op: 'set',
      path: `/authGroups/${index}`,
      value: group,
    });
  }

  const res2 = await dashboardContainer
    .item(dashboardId, dashboardId)
    .patch(patchArr);

  const resource = res2.resource;

  return {
    authGroups: resource.authGroups,
    dashboardId: resource.id,
    dashboardName: resource.name,
  };
};

// export const upsertDashboardGroupAuth = async (
//   data: DashboardGroupAuthUpdateReq,
// ): Promise<DashboardGroupAuthUpdateRes> => {
//   checkFields(data.authGroups);

//   const dashboardContainer = await fetchContainer(DASHBOARDS);
//   const dashboardId = data.dashboardId;

//   const res = await dashboardContainer.item(dashboardId, dashboardId).read();

//   const resAuthGroups = res.resource.authGroups;

//   const patchOperations: PatchOperation[] = [];

//   for (const prop in data.authGroups) {
//     const obsoleteEl = [];
//     const newEl = [];

//     for (const [indexJ, elJ] of data.authGroups[prop].entries()) {
//       if (
//         !resAuthGroups[prop].some((el) => el.groupId === elJ.groupId) &&
//         (newEl.length === 0 ||
//           newEl.some(
//             (el) => el?.el.groupId !== elJ.groupId && el?.index !== indexJ,
//           ))
//       ) {
//         newEl.push({ el: elJ, index: indexJ });
//       }
//     }
//     for (const [index, el] of resAuthGroups[prop]?.entries()) {
//       if (
//         !data.authGroups[prop].some((el2) => el2.groupId === el.groupId) &&
//         (obsoleteEl.length === 0 ||
//           obsoleteEl.some(
//             (el2) => el2?.el.groupId !== el.groupId && el2?.index !== index,
//           ))
//       ) {
//         obsoleteEl.push({ el: el, index: index });
//       }
//     }

//     for (const [index, el] of obsoleteEl.entries()) {
//       if (newEl[index]) {
//         patchOperations.push({
//           op: 'set',
//           path: `/authGroups/${prop}/${el.index}`,
//           value: newEl[index].el,
//         });
//       } else {
//         patchOperations.push({
//           op: 'remove',
//           path: `/authGroups/${prop}/${el.index}`,
//         });
//       }
//     }
//     for (const [index, el] of newEl.entries()) {
//       if (!obsoleteEl[index]) {
//         patchOperations.push({
//           op: 'add',
//           path: `/authGroups/${prop}/-`,
//           value: el.el,
//         });
//       }
//     }

//     // if (resAuthGroups[prop].length > 0) {
//     //   for (const [index, el] of resAuthGroups[prop]?.entries()) {
//     //     if (data.authGroups[prop].indexOf(el) === -1) {
//     //       patchOperations.push({
//     //         op: 'remove',
//     //         path: `/authGroups/${prop}/${index}`,
//     //       });
//     //     }
//     //   }
//     // }

//     // for (const [index, el] of data.authGroups[prop].entries()) {
//     //   if (resAuthGroups[prop].indexOf(el) === -1) {
//     //     patchOperations.push({
//     //       op: 'add',
//     //       path: `/authGroups/${prop}/-`,
//     //       value: el,
//     //     });
//     //   }
//     // }
//   }

//   const res2 = await dashboardContainer
//     .item(dashboardId, dashboardId)
//     .patch(patchOperations);

//   return {
//     authGroups: res2.resource.authGroups,
//     dashboardId,
//     dashboardName: res2.resource.name,
//   };
// };
