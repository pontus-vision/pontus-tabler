import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { GridUpdateState } from './store/sliceGridUpdate';
import {
  Dashboard,
  DataRoot,
  ICmsGetContentModel,
  ICmsGetContentModelData,
  ICmsGetContentModelDataField,
  IListModelResponseData,
  Meta,
} from './types';
import {
  cmsCreateModelFrom,
  cmsDeleteEntry,
  cmsEntriesCreateModel,
  cmsGetContentModel,
  cmsPublishModelId,
  getModelsWebiny,
  listApiKeys,
  listModel,
} from './webinyApi';
import {
  AgGridInput,
  AgGridOutput,
  DeleteGroup,
  DeleteTableRow,
  GetTablesResponse,
  AuthGroup,
  GroupReadBody,
  NewDashboard,
  NewGroup,
  NewTable,
  NewTableRow,
  NewUser,
  ReadDashboardsRes,
  ReadGroupsRes,
  ReadPaginationFilter,
  ReadPaginationFilter2,
  ReadUsersRes,
  Table,
  UpdateDashboard,
  UpdateGroup,
  UpdateTable,
  UpdateTableRow,
  UpdateUser,
  User,
} from './pontus-api/typescript-fetch-client-generated';
import { useTranslation } from 'react-i18next';
import { D } from 'msw/lib/glossary-de6278a9';
import { sendHttpRequest } from './http';

export const getModelData = async (
  modelId: string,
  limit: number,
  after: string | null,
  fieldsSearches = null,
  sorting?: string,
): Promise<
  | {
      columnNames: ICmsGetContentModelDataField[];
      modelContentListData: IListModelResponseData[];
      meta: Meta;
    }
  | undefined
> => {
  const cmsContentModel = await cmsGetContentModel(modelId);
  const { fields: columnNames } = cmsContentModel.data;
  const data = await listModel(
    modelId,
    columnNames,
    limit,
    after,
    fieldsSearches,
    sorting,
  );
  if (!data) return;
  const { data: modelContentListData, meta } = data;

  return { columnNames, modelContentListData, meta };
};

const api = axios.create({
  baseURL: 'http://localhost:8080/PontusTest/1.0.0/',
  headers: {
    Authorization: 'Bearer 123456',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

// wrapper for every post request. eg. handling errors like Too Many Requests (429), internal server error (500), 503...
const post = async (url: string, data?: any) => {
  const baseURL = 'http://localhost:8080/PontusTest/1.0.0';
  const headers = {
    Authorization: 'Bearer 123456',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  return sendHttpRequest(baseURL + url, headers, '', data, 'POST');
};

export const readMenu = async (): Promise<
  AxiosResponse<DataRoot> | undefined
> => {
  return post('/menu', {});
};

export const getTables = async (): Promise<
  AxiosResponse<GetTablesResponse> | undefined
> => {
  return post('/tables/read', {});
};

export const getTable = async (
  tableId: string,
): Promise<AxiosResponse<Table> | undefined> => {
  return post('/table/read', { tableId });
};

export const createTable = async (
  data: NewTable,
): Promise<AxiosResponse<GetTablesResponse, any> | undefined> => {
  return post('/table/create', data);
};

export const updateTable = async (
  body: UpdateTable,
): Promise<AxiosResponse<Table, any> | undefined> => {
  return post('table/update', body);
};

export const deleteTable = async (
  tableId: string,
): Promise<AxiosResponse<string, any> | undefined> => {
  return post('table/delete', { tableId });
};

export const createDataTable = async (body: NewTableRow) => {
  return post('/table/data/create', body);
};

export const readDataTable = async (
  body: AgGridInput,
): Promise<AxiosResponse<AgGridOutput> | undefined> => {
  return post('/table/data/read', {});
};

export const updateDataTableRow = async (body: UpdateTableRow) => {
  return post('/table/data/update');
};

export const deleteDataTableRow = async (
  body: DeleteTableRow,
): Promise<AxiosResponse<string> | undefined> => {
  return post('/table/data/delete', body);
};

export const getAllDashboards = async (
  body: ReadPaginationFilter,
): Promise<AxiosResponse<ReadDashboardsRes> | undefined> => {
  return post('/dashboards/read', body);
};

export const createDashboard = async (
  body: NewDashboard,
): Promise<AxiosResponse<Dashboard> | undefined> => {
  return post('/dashboard/create', {});
};

export const getDashboard = async (
  dashboardId: string,
): Promise<AxiosResponse<Dashboard> | undefined> => {
  return post('/dashboard/read', { dashboardId });
};

export const updateDashboard = async (
  body: UpdateDashboard,
): Promise<AxiosResponse<string> | undefined> => {
  return post('/dashboard/update', { ...body });
};

export const deleteDashboard = async (
  dashboardId: string,
): Promise<AxiosResponse<string> | undefined> => {
  return post('/dashboard/delete', { dashboardId });
};

export const createAuthGroup = async (
  body: NewGroup,
): Promise<AxiosResponse<AuthGroup> | undefined> => {
  return post('/auth/group/create', body);
};

export const readAuthGroups = async (
  data: ReadPaginationFilter,
): Promise<AxiosResponse<ReadGroupsRes> | undefined> => {
  try {
    const res = await api.post('/auth/groups/read', { ...body });

export const deleteAuthGroup = async (
  body: DeleteGroup,
): Promise<AxiosResponse<Response> | undefined> => {
  return post('/auth/group/delete', body);
};

<<<<<<< HEAD
=======
export const createUser = async (
  body: NewUser,
): Promise<AxiosResponse<User> | undefined> => {
  return post('/auth/user/create', body);
};

export const readUsers = async (
  body: ReadPaginationFilter,
): Promise<AxiosResponse<ReadUsersRes> | undefined> => {
  return post('/auth/users/read', {});
};

export const updateUser = async (
  body: UpdateUser,
): Promise<AxiosResponse<Response>> => {
  return post('/auth/user/update', body);
};

export const deleteUser = async (
  userId: string,
): Promise<AxiosResponse<Response> | undefined> => {
  return post('auth/user/delete', { userId });
};

export const getApiKeys = async () => {
  const data = await listApiKeys();

  return data;
};

export const getModelFields = async (
  tableId: string,
): Promise<AxiosResponse<Table> | undefined> => {
  return post('/table/read', { tableId });
};

export const deleteEntry = async (modelId: string, entryId: string) => {
  try {
    const { data } = await cmsDeleteEntry(modelId, entryId);

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const postNewEntry = async (
  dataInput: {
    [key: string]: unknown;
  },
  fields: ICmsGetContentModelDataField[],
  modelId: string,
) => {
  const fieldsKeysStr = createMutationStr(fields);

  try {
    const { data } = await cmsEntriesCreateModel(
      modelId,
      dataInput,
      fieldsKeysStr,
    );

    if (data.id) {
      const { data: publishedData } = await cmsPublishModelId(modelId, data.id);
      return publishedData;
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateEntry = async (
  dataInput: {
    [key: string]: unknown;
  },
  fields: ICmsGetContentModelDataField[],
  modelId: string,
  rowId: string,
) => {
  const fieldsKeysStr = createMutationStr(fields);

  const { data } = await cmsCreateModelFrom(
    modelId,
    dataInput,
    fieldsKeysStr,
    rowId,
  );

  if (data.id) {
    const { data: publishedData } = await cmsPublishModelId(modelId, data.id);

    return publishedData;
  }
};

const createMutationStr = (fields: ICmsGetContentModelDataField[]): string => {
  let str = '';

  fields.forEach((field) => {
    if (field.type === 'text' || field.type === 'long-text') {
      str += `${field.fieldId}\n`;
    } else if (field.type === 'ref') {
      str += `${field.fieldId} {
      modelId
      id
      __typename
    }\n`;
    } else if (field.type === 'object' && field?.settings) {
      const objFields = field.settings.fields;

      if (!objFields) return;
      str += `${field.fieldId} {
        ${createMutationStr(objFields)}
      }\n`;
    }
  });

  return str;
};
