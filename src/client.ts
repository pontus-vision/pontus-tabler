import axios from "axios";

const webinyApi = axios.create({
  baseURL: `https://d2ekewy9aiz800.cloudfront.net/`,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_WEBINY_API_TOKEN}`,
  },
});

export const listModel = async (modelId: string, fields: any) => {
  // const arr1 = arr.map(el=> !!el.settings.models && el.settings?.models.find(model=>model.modelId)  )
  // const arr2 = arr1.map((el) => el.fieldId).join(" ");
  const refInputField = fields.filter(el => el.renderer.name === "ref-input")
 

  const arrMap =await Promise.all(fields.map(async field=> {
    const findRefModel = (field) => {return field.settings?.models?.find(model=>model?.modelId)?.modelId}
    const objFields = field?.settings?.fields



    if (findRefModel(field)) {  
      const refModel = await getContentModel(findRefModel(field))
      return `${field.fieldId}{${refModel.titleFieldId}}`
    }
    else if(objFields) {
      console.log({objFields})
      const objFieldsIds = await Promise.all(objFields.map(async el=>{ 
        if(findRefModel(el)) {
          const objFieldRefModel = await getContentModel(findRefModel(el)) 
          return `${el.fieldId}{${objFieldRefModel.titleFieldId}}` 
        }
        return `${el.fieldId}`
      }))
      return `${field.fieldId}{${objFieldsIds}}`
    }
    else {
      return field.fieldId
    }
  }))

 
  const modelIdFormatted = modelId[modelId.length -1] !== "s" ? modelId + "s" : modelId

  const res = await webinyApi.post("cms/read/en-US", {
    query: `
{
  list${capitalizeFirstLetter(modelIdFormatted)} {
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
  }
}
`,
  });
  return res.data.data[`list${capitalizeFirstLetter(modelIdFormatted)}`].data; 
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
  console.log(data)
  return data;
  // listModel(modelId, fields);
};

export const cmsGetContentModel = async (modelId: string) => {
  // modelId = modelId[modelId.length-1] === "s" ? modelId.slice(0,-1) : modelId
  console.log(modelId)

  const data = webinyApi.post("cms/manage/en-US", {
    
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
      modelId
    }
  })
  return data
}

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

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
