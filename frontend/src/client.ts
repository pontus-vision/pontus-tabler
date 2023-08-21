import axios, { AxiosResponse } from 'axios';
import { GridUpdateState } from './store/sliceGridUpdate';
import {
  Dashboard,
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
  Configuration,
  DefaultApiFetchParamCreator,
  DeleteTableRow,
  GetTablesResponse,
  NewDashboard,
  NewTable,
  NewTableRow,
  ReadDashboardsRes,
  ReadPaginationFilter,
  Table,
  UpdateDashboard,
  UpdateTable,
  UpdateTableRow,
} from './pontus-api/typescript-fetch-client-generated';
import { useTranslation } from 'react-i18next';

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

  // console.log({ modelContentListData });
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

(async () => {
  console.log(await api.post('/tables/read', {}), await getModelsWebiny());
  console.log(
    await api.post('/tables/read', {}),
    await cmsGetContentModel('titulares'),
  );
})();

export const getTables = async (): Promise<
  AxiosResponse<GetTablesResponse> | undefined
> => {
  try {
    const data = await api.post('/tables/read', {});

    return data;
  } catch (error) {
    console.error(error);
  }
  // const listModels = data.data.listContentModels.data;
};

export const getTable = async (
  tableId: string,
): Promise<AxiosResponse<Table> | undefined> => {
  try {
    const res = await api.post('/table/read', { tableId });

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const createTable = async (
  data: NewTable,
): Promise<AxiosResponse<GetTablesResponse, any> | undefined> => {
  try {
    const res = await api.post('/table/create', data);

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const updateTable = async (
  data: UpdateTable,
): Promise<AxiosResponse<Table, any> | undefined> => {
  try {
    const res = await api.post('table/update', data);

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const deleteTable = async (
  tableId: string,
): Promise<AxiosResponse<string, any> | undefined> => {
  try {
    const res = await api.post('table/delete', { tableId });

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const createDataTable = async (body: NewTableRow) => {
  try {
    const res = await api.post('/table/data/create', { body });

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const readDataTable = async (
  body: AgGridInput,
): Promise<AxiosResponse<AgGridOutput> | undefined> => {
  try {
    const res = await api.post('/table/data/read', {});

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const updateDataTableRow = async (body: UpdateTableRow) => {
  try {
    const res = await api.post('/table/data/update');

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteDataTableRow = async (
  body: DeleteTableRow,
): Promise<AxiosResponse<string> | undefined> => {
  try {
    const res = await api.post('/table/data/delete', { ...body });

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getAllDashboards = async (
  body: ReadPaginationFilter,
): Promise<AxiosResponse<ReadDashboardsRes> | undefined> => {
  try {
    const res = await api.post('/dashboards/read', { body });

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const createDashboard = async (
  body: NewDashboard,
): Promise<AxiosResponse<Dashboard> | undefined> => {
  try {
    const res = await api.post('/dashboard/create', {});

    return res;
  } catch (error) {
    throw error;
  }
};

export const getDashboard = async (
  dashboardId: string,
): Promise<AxiosResponse<Dashboard> | undefined> => {
  try {
    const res = await api.post('/dashboard/read', { dashboardId });

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const updateDashboard = async (
  body: UpdateDashboard,
): Promise<AxiosResponse<string> | undefined> => {
  try {
    const res = await api.post('/dashboard/update', { body });

    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteDashboard = async (
  dashboardId: string,
): Promise<AxiosResponse<string> | undefined> => {
  try {
    const res = await api.post('/dashboard/delete', { dashboardId });

    return res;
  } catch (error) {
    throw error;
  }
};

export const getModelFields = async (
  tableId: string,
): Promise<Table | undefined> => {
  // try {
  //   const { data } = await cmsGetContentModel(modelId);

  //   console.log({ data });
  //   return data;
  // } catch (error) {
  //   console.error(error);
  // }

  const data = await api.post('/table/read', { tableId });

  console.log({ data });

  return data;
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

export const getApiKeys = async () => {
  const data = await listApiKeys();

  return data;
};
