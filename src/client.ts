import axios from "axios";

const webinyApi = axios.create({
  baseURL: `https://d2ekewy9aiz800.cloudfront.net/`,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_WEBINY_API_TOKEN}`,
  },
});

export const listModel = async (modelId: string, data: any) => {
  // const arr1 = arr.map(el=> !!el.settings.models && el.settings?.models.find(model=>model.modelId)  )
  // const arr2 = arr1.map((el) => el.fieldId).join(" ");
  const refInputField = data.fields.filter(el => el.renderer.name === "ref-input")
 
  const fieldss = []

  const array =  refInputField.map(async field=>{
    const refModel = await getContentModel(field.settings.models.find(model=>model.modelId).modelId)
    return `${field.fieldId}{${refModel.titleFieldId}}`
  })

  console.log(await Promise.all(array))
  

  const arrMap =await Promise.all(data.fields.map(async field=> {
    const findRefModel = (field) => {return field.settings?.models?.find(model=>model?.modelId)?.modelId}
    const objFields = field?.settings?.fields



    if (findRefModel(field)) {  
      const refModel = await getContentModel(findRefModel(field))
    return `${field.fieldId}{${refModel.titleFieldId}}`    }
    else if(objFields) {
      console.log({objFields})
      const objFieldsIds =await Promise.all(objFields.map(async el=>{ 
        if(findRefModel(field)) {
          const objFieldRefModel = await getContentModel(findRefModel(el))
          
        }
        return el.fieldId
      }))
      return `${field.fieldId}{${objFieldsIds}}`
    }
    else {
      return field.fieldId
    }
  }))

  console.log(arrMap)




  
  
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
  console.log(res);

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
  console.log(data);
  return data;
  // listModel(modelId, fields);
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

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
