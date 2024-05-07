import {
  AuthGroupRef,
  AuthUserAndGroupsRef,
  AuthUserCreateReq,
  AuthUserCreateRes,
  AuthUserDeleteReq,
  AuthUserDeleteRes,
  AuthUserGroupsCreateReq,
  AuthUserGroupsCreateRes,
  AuthUserGroupsDeleteReq,
  AuthUserGroupsDeleteRes,
  AuthUserGroupsReadReq,
  AuthUserGroupsReadRes,
  AuthUserGroupsUpdateReq,
  AuthUserGroupsUpdateRes,
  AuthUserReadReq,
  AuthUserReadRes,
  AuthUserRef,
  AuthUserUpdateReq,
  AuthUserUpdateRes,
  AuthUsersReadReq,
  AuthUsersReadRes,
} from '../typescript/api';
import { fetchContainer, fetchData, filterToQuery } from '../cosmos-utils';
import { Item, ItemResponse, PatchOperation } from '@azure/cosmos';
import { InternalServerError, NotFoundError } from '../generated/api';
import { patch } from '@azure/functions/types/app';

export const AUTH_USERS = 'auth_users';
export const AUTH_GROUPS = 'auth_groups';

export const authUserCreate = async (
  data: AuthUserCreateReq,
): Promise<AuthUserCreateRes> => {
  const authUserContainer = await fetchContainer(AUTH_USERS);

  const res = await authUserContainer.items.create({ ...data, authGroups: [] });

  const { id, name } = res.resource;

  return {
    name,
    id,
  };
};

export const authUserRead = async (
  data: AuthUserReadReq,
): Promise<AuthUserReadRes> => {
  const authUserContainer = await fetchContainer(AUTH_USERS);

  const userId = data.id;

  const res = (await authUserContainer
    .item(userId, userId)
    .read()) as ItemResponse<AuthUserRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError(`User not found at id: ${data.id}`);
  }

  const { id, name } = res.resource;

  return {
    id,
    name,
  };
};

export const authUserUpdate = async (
  data: AuthUserUpdateReq,
): Promise<AuthUserUpdateRes> => {
  const authUserContainer = await fetchContainer(AUTH_USERS);

  try {
    const res = (await authUserContainer
      .item(data.id, data.id)
      .patch([
        { op: 'replace', path: '/name', value: data.name },
      ])) as ItemResponse<AuthUserRef>;

    const { id, name } = res.resource;

    return {
      id,
      name,
    };
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(`No user found at id: ${data.id}`);
    }
  }
};

export const authUserDelete = async (
  data: AuthUserDeleteReq,
): Promise<AuthUserDeleteRes> => {
  const authUserContainer = await fetchContainer(AUTH_USERS);
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  const authUserDoc = await authUserContainer.item(data.id, data.id);

  const res = (await authUserDoc.read()) as ItemResponse<AuthUserAndGroupsRef>;

  if (res.statusCode === 404) {
    throw new NotFoundError(`No user found at id: ${data.id}`);
  }

  for (const [index, authGroup] of res.resource.authGroups.entries()) {
    try {
      const authGroupDoc = await authGroupContainer.item(
        authGroup.id,
        authGroup.id,
      );
      const res = await authGroupDoc.read();

      const index = res.resource.authUsers.findIndex((el) => el.id === data.id);

      const res2 = await authGroupDoc.patch([
        { op: 'remove', path: `/authUsers/${index}` },
      ]);
    } catch (error) {}
  }

  const res2 = await authUserDoc.delete();

  if (res2.statusCode !== 204) {
    throw new InternalServerError(`Could not delete User at id '${data.id}'`);
  }

  return `User at id "${data.id}" deleted!`;
};

export const authUsersRead = async (
  data: AuthUsersReadReq,
): Promise<AuthUsersReadRes> => {
  try {
    const res = await fetchData(data, AUTH_USERS);
    return {
      authUsers: res.values,
      count: res.count,
    };
  } catch (error) {
    if (error?.code === 404) {
      throw new NotFoundError(`Auth User(s) not found.`);
    }
  }
};

export const authUserGroupsCreate = async (
  data: AuthUserGroupsCreateReq,
): Promise<AuthUserGroupsCreateRes> => {
  const authUserContainer = await fetchContainer(AUTH_USERS);
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  const authUserDoc = await authUserContainer.item(data.id, data.id);

  const authUser = (await authUserDoc.read()) as ItemResponse<AuthUserRef>;

  if (authUser.statusCode === 404) {
    throw new NotFoundError(`No Auth User found at id: ${data.id}`);
  }

  const patchArr: PatchOperation[] = [];

  for (const [index, groupId] of data.authGroupsIds.entries()) {
    try {
      const authGroupRes = (await authGroupContainer
        .item(groupId, groupId)
        .patch([
          {
            op: 'add',
            path: '/authUsers/-',
            value: {
              id: authUser.resource.id,
              name: authUser.resource.name,
            },
          },
        ])) as ItemResponse<AuthGroupRef>;

      patchArr.push({
        op: 'add',
        path: '/authGroups/-',
        value: {
          name: authGroupRes.resource.name,
          id: authGroupRes.resource.id,
        },
      });

      if (index === data.authGroupsIds.length - 1) {
        const res = (await authUserDoc.patch(
          patchArr,
        )) as ItemResponse<AuthUserAndGroupsRef>;

        return {
          authGroups: res.resource?.authGroups,
          id: authUser.resource?.id,
          name: authUser.resource?.name,
        };
      }
    } catch (error) {
      if (error?.code === 404) {
        throw new NotFoundError(`No Auth Group found at id: ${groupId}`);
      }
    }
  }
};

export const authUserGroupsRead = async (
  data: AuthUserGroupsReadReq,
): Promise<AuthUserGroupsReadRes> => {
  const authUserContainer = await fetchContainer(AUTH_USERS);

  const userId = data.id;

  const str = filterToQuery(
    { filters: data.filters },
    'p',
    `c.id = "${userId}"`,
  );
  const countStr = `SELECT VALUE COUNT(1) FROM c JOIN p IN c.authGroups ${str}`;

  const str2 = filterToQuery(
    { filters: data.filters, from: data.from, to: data.to },
    'p',
    `c["id"] = "${userId}"`,
  );

  const query = `SELECT p["name"], p["id"] FROM c JOIN p IN c["authGroups"] ${str2}`;

  const res = await authUserContainer.items
    .query({
      query,
      parameters: [],
    })
    .fetchAll();

  const res2 = await authUserContainer.items
    .query({
      query: countStr,
      parameters: [],
    })
    .fetchAll();

  if (res.resources.length === 0) {
    throw new NotFoundError('No group auth found.');
  }

  return {
    count: res2.resources[0],
    authGroups: res.resources,
  };
};

export const authUserGroupsDelete = async (
  data: AuthUserGroupsDeleteReq,
): Promise<AuthUserGroupsDeleteRes> => {
  const authUserContainer = await fetchContainer(AUTH_USERS);
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  const authUserDoc = await authUserContainer.item(data.id, data.id);

  const authUser =
    (await authUserDoc.read()) as ItemResponse<AuthUserAndGroupsRef>;
  if (authUser.statusCode === 404) {
    throw new NotFoundError(`No user found at id "${data.id}"`);
  }

  const patchArr: PatchOperation[] = [];

  for (const [index, groupId] of data.authGroupsIds.entries()) {
    const authGroup = await authGroupContainer.item(groupId, groupId).read();

    if (authGroup.statusCode === 404) {
      throw new NotFoundError(`No Auth Group found at id: ${groupId}`);
    }

    const index = authGroup.resource.authUsers.findIndex(
      (el) => el.id === data.id,
    );

    const authGroupRes = (await authGroupContainer
      .item(groupId, groupId)
      .patch([
        {
          op: 'remove',
          path: `/authUsers/${index}`,
        },
      ])) as ItemResponse<AuthGroupRef>;

    const indexAuthUserDoc = authUser.resource.authGroups.findIndex(
      (el) => el.id === groupId,
    );

    patchArr.push({
      op: 'remove',
      path: `/authGroups/${indexAuthUserDoc}`,
    });

    if (index === data.authGroupsIds.length - 1) {
      const res = (await authUserDoc.patch(
        patchArr,
      )) as ItemResponse<AuthUserAndGroupsRef>;

      return `Auth Groups deleted from user (id: '${data.id}')`;
    }
  }
};
