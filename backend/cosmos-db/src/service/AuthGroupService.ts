import { AuthGroupCreateReq, AuthGroupCreateRes } from '../typescript/api';

const createAuthGroup = async (
  data: AuthGroupCreateReq,
): Promise<AuthGroupCreateRes> => {
  return {
    groupId: '',
    name: '',
  };
};
