import axios from "axios";
import {
  ICmsGetContentModel,
  ICmsGetContentModelDataField,
  IListModelResponse,
  UnknownKey,
} from "./types";
import { CmsEntriesList } from "./types";

const webinyApi = axios.create({
  baseURL: `https://d2ekewy9aiz800.cloudfront.net/`,
  
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_WEBINY_API_TOKEN}`,
  },
});

export const listModel = async (
  modelId: string,
  fields: ICmsGetContentModelDataField[],
  limit: number,
  after: string | null,
  fieldSearches = null,
  sorting?: string
): Promise<IListModelResponse | undefined> => {
  // const arr1 = arr.map(el=> !!el.settings.models && el.settings?.models.find(model=>model.modelId)  )
  // const arr2 = arr1.map((el) => el.fieldId).join(" ");
  const refInputField = fields.filter((el) => el.renderer.name === "ref-input");

  const arrMap = await Promise.all(
    fields.map(async (field) => {
      const findRefModel = (field: ICmsGetContentModelDataField) => {
        if (field.settings) {
          return field.settings.models?.find((model) => model?.modelId)
            ?.modelId;
        }
      };
      const objFields = field?.settings?.fields;
      if (findRefModel(field)) {
        const refModel = await getContentModel(findRefModel(field));
        return `${field.fieldId}{${refModel.titleFieldId}}`;
      } else if (objFields) {
        const objFieldsIds = await Promise.all(
          objFields.map(async (el) => {
            if (findRefModel(el)) {
              const objFieldRefModel = await cmsGetContentModel(
                findRefModel(el)
              );
              return `${el.fieldId}{${objFieldRefModel.data.titleFieldId}}`;
            }
            return `${el.fieldId}`;
          })
        );
        return `${field.fieldId}{${objFieldsIds}}`;
      } else {
        return field.fieldId;
      }
    })
  );

  const modelIdFormatted =
    modelId[modelId.length - 1] !== "s" ? modelId + "s" : modelId;

  try {

    console.log(sorting)
    const containsSearches =
      fieldSearches &&
      Object.entries(fieldSearches).map(([key, value]) => {
        
        return key + "_contains: " + '"' + value.filter + '"';
      });

      const query = `
      {
        list${capitalizeFirstLetter(
          modelIdFormatted
        )} (limit: ${limit}, after: "${after}" ${
        fieldSearches ? ", where:" + "{" + containsSearches + "}" : "" 
      } ${sorting ? "sort: " + sorting : ""}) 
      {
          data {
            id
            entryId
            createdOn
            savedOn
            createdBy {
              displayName
            }
            ownedBy {
              displayName
            } 
            ${arrMap}
          }
          meta{
            cursor
            totalCount
          }
        }
      }
    `

    const res = await webinyApi.post("cms/read/en-US", {
      query 
    });

    console.log({query})
    const data = res.data.data[`list${capitalizeFirstLetter(modelIdFormatted)}`] as IListModelResponse
    return data
    
  } catch (error) {
    console.error(error);
  }
};

export const getContentModel = async (modelId: string) => {
  const res = await webinyApi.post("cms/read/en-US", {
    query: `{
  getContentModel (modelId: "${modelId}" ){
  
      data {
titleFieldId    
      modelId
      fields {
        fieldId
        id 
        storageId
        label
        helpText
        placeholderText
        type
        multipleValues
        settings
        predefinedValues {
          enabled
          values{
            label
            value
            selected
          }
        }
        renderer{
          name
        }
        validation {
        	name
        	message
          settings
        }
        listValidation {
          name
          message
          settings
        }
        
      }
    }
  }
}
`,
  });
  const { data } = res.data.data.getContentModel;
  // console.log(data);
  return data;
  // listModel(modelId, fields);
};

export const cmsGetContentModel = async (
  modelId: string
): Promise<ICmsGetContentModel> => {
  // modelId = modelId[modelId.length-1] === "s" ? modelId.slice(0,-1) : modelId

  const data = await webinyApi.post("cms/manage/en-US", {
    query: `query CmsGetContentModel($modelId: ID!) {
    getContentModel(modelId: $modelId) {
    data {
      name
      group {
        id
        name
        __typename
      }
      description
      modelId
      savedOn
      titleFieldId
      lockedFields
      layout
      fields {
        id
        fieldId
        storageId
        type
        label
        placeholderText
        helpText
        predefinedValues {
          enabled
          values {
            label
            value
            selected
            __typename
          }
          __typename
        }
        multipleValues
        renderer {
          name
          __typename
        }
        validation {
          name
          settings
          message
          __typename
        }
        listValidation {
          name
          settings
          message
          __typename
        }
        settings
        __typename
      }
      __typename
    }
    error {
      message
      code
      data
      __typename
    }
    __typename
  }
}`,
    variables: {
      modelId,
    },
  });

  const result = data.data.data.getContentModel as ICmsGetContentModel;
  return result;
};

export const getModels = async () => {
  const data = webinyApi.post("cms/read/en-US", {
    query: `{
  listContentModels {
    data {
      name
      modelId
      group {
        name
        id
      }
    }
  }
}`,
  });
  return data;
};

export const searchEntries = async (
  modelId: string,
  fieldId: string,
  entry: string,
  limit: number,
  after: string
) => {
  const modelIdCapitalized = capitalizeFirstLetter(modelId);

  try {
    const data = await webinyApi.post("cms/manage/en-US", {
      query: `  
        query CmsEntriesList${modelIdCapitalized}($where: ${modelIdCapitalized}ListWhereInput, $sort: [${modelIdCapitalized}ListSorter], $limit: Int, $after: String) {
          content: list${modelIdCapitalized}(
            where: $where
            sort: $sort
            limit: $limit
            after: $after
          ) {
            data {
              id
              savedOn
              meta {
                title
                publishedOn
                version
                locked
                status
                __typename
              }
              ${fieldId}
              __typename
            }
            meta {
              cursor
              hasMoreItems
              totalCount
              __typename
            }
            error {
              message
              code
              data
              __typename
            }
            __typename
          }
        }`,
      variables: {
        sort: ["savedOn_DESC"],
        where: {
          [`${fieldId}_contains`]: `${entry}`,
        },
        limit: +limit,
        after: after,
      },
    });

    return data.data.data.content;
  } catch (error) {
    console.error(error);
  }
};

export const getEntry = async (id: string, modelId: string) => {
  const cmsContentModel = await cmsGetContentModel(modelId);
  const fields = cmsContentModel.data.fields;

  const fieldsFormatted = fields.map((field) => {
    if (field.type === "ref") {
      return `${field.fieldId} {
        modelId 
        id 
        __typename
      }
      `;
    }
    if (field.type === "object") {
      const objFields = field?.settings?.fields?.map((el: ModelColName) => {
        if (el.type === "ref") {
          return `${el.fieldId} {
            modelId 
            id 
            __typename
          }
          `;
        }
        return `${el.fieldId}`;
      });
      // console.log({objFields})
      return `${field.fieldId} {${objFields}}`;
    }
    return `${field.fieldId}`;
  });

  try {
    const modelIdCapitalized = capitalizeFirstLetter(modelId);

    const { data } = await webinyApi.post("cms/manage/en-US", {
      query: `
    query CmsEntriesGet${modelIdCapitalized}($revision: ID!) {
      content: get${modelIdCapitalized}(revision: $revision) {
        data {
          id
          createdBy {
            id
            __typename
          }
          ${fieldsFormatted}
                    savedOn
          meta {
            title
            publishedOn
            version
            locked
            status
            __typename
          }
          __typename
        }
        error {
          message
          code
          data
          __typename
        }
        __typename
      }
    }
  `,
      variables: {
        revision: `${id}`,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const cmsEntriesCreateModel = async(modelId: string, dataInput: UnknownKey, keys: any) => {
  const modelIdCapitalized = capitalizeFirstLetter(modelId)
    console.log({modelId, dataInput, keys})

  try {  
    const query= `mutation CmsEntriesCreate${modelIdCapitalized}($data: ${modelIdCapitalized}Input!) {
      content: create${modelIdCapitalized}(data: $data) {
        data {
          id
          ${keys}
        }
      }
    }
    `
    const post = {
      query, variables: {data:dataInput}
    }

    const {data: res} = await webinyApi.post(`/cms/manage/en-US`, post)

    console.log({res, post})

    return res.data.content
  } catch (error) {
    console.error(error)
  }
}

export const cmsPublishModelId = async(modelId: string, id: string) => {
  const modelIdCapitalized = capitalizeFirstLetter(modelId)

  const query = `
    mutation CmsPublish${modelIdCapitalized}($revision: ID!) {
      content: publish${modelIdCapitalized}(revision: $revision) {
      data {
        id
        meta {
          title
          publishedOn
          version
          locked
          status
          __typename
        }
        __typename
      }
      error {
        message
        code
        data
        __typename
      }
      __typename
      }
      }
  `

    const post = {query, variables: {revision: id}}

  try {
    const {data} = await webinyApi.post("/cms/manage/en-US", post)

    
    console.log({data, post})

    return data.data.content
} catch (error) {
    console.error(error)
}
}

export const cmsCreateModelFrom = async(modelId: string, entryValues: {[key: string]: unknown}, keys: string, id: string) => {
  const modelIdCapitalized = capitalizeFirstLetter(modelId)
  console.log({modelId, entryValues, keys, id})

  const query = `
  mutation CmsCreate${modelIdCapitalized}From($revision: ID!, $data: ${modelIdCapitalized}Input) {
    content: create${modelIdCapitalized}From(revision: $revision, data: $data) {
      data {
        id
        savedOn
        ${keys}
        meta {
          title
          publishedOn
          version
          locked
          status
          __typename
        }
        __typename
      }
      error {
        message
        code
        data
        __typename
      }
      __typename
    }
  }
  `

  const post = {
    query, variables: {data: entryValues, revision: id}
  }

  try {
    const {data: res} = await webinyApi.post("/cms/manage/en-US", post )

    
    console.log({res, post})
    return res.data.content
    
  } catch (error) {
    console.error(error)
  }
}

export const cmsDeleteEntry = async(modelId: string, id: string) => {

  const query = `
  mutation CmsEntriesDeleteMapeamentoDeProcessos($revision: ID!) {
    content: deleteMapeamentoDeProcessos(revision: $revision) {
      data
      error {
        message
        code
        data
        __typename
      }
      __typename
    }
  }
  `
  const post = {query, variables: {revision: id}}

  try {
    const {data: res} = await webinyApi.post("/cms/manage/en-US", post)

    console.log({res, post})

    return res

  } catch (error) {
    console.error(error)
  }

}