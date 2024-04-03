import { fetchContainer } from '../cosmos-utils';
import {
  AuthGroupCreateReq,
  AuthGroupCreateRes,
  AuthGroupRef,
} from '../typescript/api';
import { ItemResponse, PatchOperation } from '@azure/cosmos';
const AUTH_GROUPS = 'auth_groups';

export const createAuthGroup = async (
  data: AuthGroupCreateReq,
): Promise<AuthGroupCreateRes> => {
  const authGroupContainer = await fetchContainer(AUTH_GROUPS);

  const res = (await authGroupContainer.items.create(
    data,
  )) as ItemResponse<AuthGroupRef>;

  return res.resource;
};
