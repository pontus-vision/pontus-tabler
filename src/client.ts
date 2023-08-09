import axios from 'axios';
import { GridUpdateState } from './store/sliceGridUpdate';
import {
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
  Configuration,
  DefaultApiFetchParamCreator,
  GetTablesResponse,
  NewTable,
  Table,
  UpdateTable,
} from './pontus-api/typescript-fetch-client-generated';

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

export const getTables = async (): Promise<GetTablesResponse> => {
  const { data } = await api.post('/tables/read', {});
  // const listModels = data.data.listContentModels.data;

  return data;
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

export const createTable = async (data: NewTable) => {
  try {
    console.log({ data });
    const { data: res } = await api.post('/table/create', data);

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const updateTable = async (
  data: UpdateTable,
): Promise<Table | undefined> => {
  try {
    const { data: res } = await api.post('table/update', data);

    return res;
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
