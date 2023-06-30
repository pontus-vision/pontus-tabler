import { GridUpdateState } from './store/sliceGridUpdate';
import {
  ICmsGetContentModelDataField,
  IListModelResponseData,
  Meta,
} from './types';
import {
  cmsCreateModelFrom,
  cmsEntriesCreateModel,
  cmsGetContentModel,
  cmsPublishModelId,
  listModel,
} from './webinyApi';

export const getModelFields = async (
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
