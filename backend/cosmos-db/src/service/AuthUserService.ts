import {
  AuthUserAndGroupsRef,
  AuthUserCreateReq,
  AuthUserCreateRes,
  AuthUserDeleteReq,
  AuthUserDeleteRes,
  AuthUserReadReq,
  AuthUserReadRes,
  AuthUserRef,
  AuthUserUpdateReq,
  AuthUserUpdateRes,
  AuthUsersReadReq,
  AuthUsersReadRes,
} from '../typescript/api';
import { fetchContainer, fetchData } from '../cosmos-utils';
import { ItemResponse } from '@azure/cosmos';
import { NotFoundError } from '../generated/api';

const AUTH_USERS = 'auth_users';
const AUTH_GROUPS = 'auth_groups';

// export const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.sendStatus(401); // Unauthorized
//   }

//   try {
//     const decoded = verifyToken(token);
//     req.user = decoded; // Attach the decoded token to the request object
//     next();
//   } catch (error) {
//     return res.sendStatus(403); // Forbidden
//   }
// };

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

  const res2 = (await authUserDoc.read()) as ItemResponse<AuthUserAndGroupsRef>;

  for (const [index, authGroup] of res2.resource.authGroups.entries()) {
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

  const res = await authUserDoc.delete();

  if (res.statusCode === 404) {
    throw new NotFoundError(`No user found at id: ${data.id}`);
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
      throw new NotFoundError(`Auth Group not found.`);
    }
  }
};
