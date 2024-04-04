import { fetchContainer, fetchData } from '../cosmos-utils';
import { AuthGroupsReadReq } from '../generated/api';
import {
  AuthGroupCreateReq,
  AuthGroupCreateRes,
  AuthGroupDeleteReq,
  AuthGroupDeleteRes,
  AuthGroupReadReq,
  AuthGroupReadRes,
  AuthGroupRef,
  AuthGroupUpdateReq,
  AuthGroupUpdateRes,
  AuthGroupsReadRes,
} from '../typescript/api';
import { ConflictEntityError, NotFoundError } from '../generated/api';

import { ItemResponse, PatchOperation } from '@azure/cosmos';
export const AUTH_GROUPS = 'auth_groups';

export const createAuthGroup = async (
  data: AuthGroupCreateReq,
): Promise<AuthGroupCreateRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  try {
    const res = (await authGroupContainer.items.create(
      data,
    )) as ItemResponse<AuthGroupRef>;

    return res.resource;
  } catch (error) {
    if (error?.code === 409) {
      throw new ConflictEntityError(`id: ${data.id} already taken.`);
    }
  }
};

export const updateAuthGroup = async (
  data: AuthGroupUpdateReq,
): Promise<AuthGroupUpdateRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  const patchArr: PatchOperation[] = [];
  for (const prop in data) {
    switch (prop) {
      case 'name':
        patchArr.push({
          op: 'replace',
          path: '/name',
          value: data[prop],
        });
        break;
      case 'parents':
        patchArr.push({
          op: 'replace',
          path: '/parents',
          value: data[prop],
        });
        break;
      case 'symlinks':
        patchArr.push({
          op: 'replace',
          path: '/symlinks',
          value: data[prop],
        });
        break;
      default:
        break;
    }
  }
  try {
    const res = (await authGroupContainer
      .item(data.id, data.id)
      .patch(patchArr)) as ItemResponse<AuthGroupRef>;

    return res.resource;
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(`No Auth Group found at id: ${data.id}`);
    }
  }
};

export const readAuthGroup = async (
  data: AuthGroupReadReq,
): Promise<AuthGroupReadRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  const res = (await authGroupContainer
    .item(data.id, data.id)
    .read()) as ItemResponse<AuthGroupRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError(`No Auth Group found at id: ${data.id}`);
  }

  return res.resource;
};

export const deleteAuthGroup = async (
  data: AuthGroupDeleteReq,
): Promise<AuthGroupDeleteRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  try {
    const res = (await authGroupContainer
      .item(data.id, data.id)
      .delete()) as ItemResponse<AuthGroupRef>;
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(`Auth Group not found at id: ${data.id}`);
    }
  }

  return `AuthGroup deleted.`;
};

export const readAuthGroups = async (
  data: AuthGroupsReadReq,
): Promise<AuthGroupsReadRes> => {
  try {
    const res = await fetchData(data, AUTH_GROUPS);
    return { authGroups: res.values, totalGroups: res.count };
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(`Auth Group not found.`);
    }
  }
};
