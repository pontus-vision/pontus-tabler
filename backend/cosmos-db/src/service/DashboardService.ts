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
  DashboardAuthGroups,
  DashboardGroupAuthDeleteReqBody,
  AuthGroupIds,
} from '../typescript/api';
import { FetchData, fetchContainer, fetchData } from '../cosmos-utils';
import {
  NotFoundError,
  ConflictEntityError,
  BadRequestError,
} from '../generated/api';
import { ItemResponse, PatchOperation } from '@azure/cosmos';

const DASHBOARDS = 'dashboards';

export const upsertDashboard = async (
  data: DashboardCreateReq | DashboardUpdateReq,
) => {
  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const res = await dashboardContainer.items.upsert({
    ...data,
    authGroups: { create: [], read: [], update: [], delete: [] },
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
  checkFields(data.authGroups);

  const dashboardContainer = await fetchContainer(DASHBOARDS);
  const dashboardId = data.dashboardId;

  const res = await dashboardContainer.item(dashboardId, dashboardId).read();
  const authGroups = res.resource.authGroups;

  const patchArr: PatchOperation[] = [];

  for (const prop in data.authGroups) {
    for (const [index, el] of data.authGroups[prop]?.entries()) {
      patchArr.push({
        op: 'add',
        path: `/authGroups/${prop}/-`,
        value: el,
      });
    }
  }

  const res2 = await dashboardContainer
    .item(dashboardId, dashboardId)
    .patch(patchArr);

  return {
    authGroups: res2.resource.authGroups,
    dashboardId,
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

  var requestCharge = res3.headers['x-ms-request-charge'];

  return {
    authGroups: res3.resource?.authGroups,
    dashboardId: res3.resource?.id,
    dashboardName: res3.resource?.name,
  };
};

export const deleteDashboardGroupAuth = async (
  data: DashboardGroupAuthDeleteReq,
): Promise<DashboardGroupAuthDeleteRes> => {
  checkFields(data.authGroups);

  const dashboardContainer = await fetchContainer(DASHBOARDS);

  const dashboardId = data.dashboardId;

  const res3 = await dashboardContainer.item(dashboardId, dashboardId).read();

  const resource = res3.resource as DashboardGroupAuthReadRes;

  const resAuthGroups = resource.authGroups;

  const patchArr: PatchOperation[] = [];

  for (const prop in data.authGroups) {
    for (const [index, el] of data.authGroups[prop].entries()) {
      const indexUpdate = resAuthGroups[prop].findIndex(
        (el2) => el2.groupId === el,
      );

      patchArr.push({
        op: 'remove',
        path: `/authGroups/${prop}/${indexUpdate}`,
      });
    }
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

export const upsertDashboardGroupAuth = async (
  data: DashboardGroupAuthUpdateReq,
): Promise<DashboardGroupAuthUpdateRes> => {
  checkFields(data.authGroups);

  const dashboardContainer = await fetchContainer(DASHBOARDS);
  const dashboardId = data.dashboardId;

  const res = await dashboardContainer.item(dashboardId, dashboardId).read();

  const resAuthGroups = res.resource.authGroups;

  const patchOperations: PatchOperation[] = [];

  for (const prop in data.authGroups) {
    const obsoleteEl = [];
    const newEl = [];

    for (const [indexJ, elJ] of data.authGroups[prop].entries()) {
      if (
        !resAuthGroups[prop].some((el) => el.groupId === elJ.groupId) &&
        (newEl.length === 0 ||
          newEl.some(
            (el) => el?.el.groupId !== elJ.groupId && el?.index !== indexJ,
          ))
      ) {
        newEl.push({ el: elJ, index: indexJ });
      }
    }
    for (const [index, el] of resAuthGroups[prop]?.entries()) {
      if (
        !data.authGroups[prop].some((el2) => el2.groupId === el.groupId) &&
        (obsoleteEl.length === 0 ||
          obsoleteEl.some(
            (el2) => el2?.el.groupId !== el.groupId && el2?.index !== index,
          ))
      ) {
        obsoleteEl.push({ el: el, index: index });
      }
    }

    for (const [index, el] of obsoleteEl.entries()) {
      if (newEl[index]) {
        patchOperations.push({
          op: 'set',
          path: `/authGroups/${prop}/${el.index}`,
          value: newEl[index].el,
        });
      } else {
        patchOperations.push({
          op: 'remove',
          path: `/authGroups/${prop}/${el.index}`,
        });
      }
    }
    for (const [index, el] of newEl.entries()) {
      if (!obsoleteEl[index]) {
        patchOperations.push({
          op: 'add',
          path: `/authGroups/${prop}/-`,
          value: el.el,
        });
      }
    }

    // if (resAuthGroups[prop].length > 0) {
    //   for (const [index, el] of resAuthGroups[prop]?.entries()) {
    //     if (data.authGroups[prop].indexOf(el) === -1) {
    //       patchOperations.push({
    //         op: 'remove',
    //         path: `/authGroups/${prop}/${index}`,
    //       });
    //     }
    //   }
    // }

    // for (const [index, el] of data.authGroups[prop].entries()) {
    //   if (resAuthGroups[prop].indexOf(el) === -1) {
    //     patchOperations.push({
    //       op: 'add',
    //       path: `/authGroups/${prop}/-`,
    //       value: el,
    //     });
    //   }
    // }
  }

  const res2 = await dashboardContainer
    .item(dashboardId, dashboardId)
    .patch(patchOperations);

  return {
    authGroups: res2.resource.authGroups,
    dashboardId,
    dashboardName: res2.resource.name,
  };
};

const checkFields = (authGroups: DashboardAuthGroups | AuthGroupIds) => {
  const wrongFieldsArr = [];

  for (const prop in authGroups) {
    if (!authGroups[prop]) {
      wrongFieldsArr.push(prop);
    }
  }

  if (wrongFieldsArr.length > 0) {
    throw new BadRequestError(
      `${wrongFieldsArr.length > 1 ? 'fields' : 'field'} ${wrongFieldsArr
        .map((el) => `'${el?.toUpperCase()}'`)
        .join(', ')} cannot be null or undefined.`,
    );
  }
};
