import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { cmsGetContentModel, getContentModel, listModel } from "../client";

const ModelView = () => {
  const {modelId} = useSelector(state => state.model)
  const [entriesList, setEntriesList] = useState<any[]>()
  const [headersList, setHeadersList] = useState<any[]>()

  const getModelFields = async(modelId: string) => {
    const contentModel = await getContentModel(modelId)
    
    
    const cmsContentModel = await cmsGetContentModel(modelId)

    const {fields} = cmsContentModel.data.data.getContentModel.data


    const modelContentList = await listModel(modelId, fields) 
    setEntriesList(modelContentList)
    
   // setHeadersList(modelContentList.map(model=>{
   //    const {createdOn, createdBy, id, ownedBy, savedOn, entryId, ...rest} = model
   //    return rest
   //  }))
    setHeadersList(fields)

    
  } 
  useEffect(()=>{
    getModelFields(modelId)
    

  },[modelId])

  useEffect(()=>{
    console.log(entriesList)
  },[entriesList])

  useEffect(()=>{
    console.log(headersList)
  },[headersList])

  return(
    <>
    <h1>{modelId}</h1>
    <table className="table table-striped">
      <thead>
        <tr>
            {!!headersList && headersList.map(key=><th scope="col">{key.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {!!entriesList && !!headersList && entriesList.map(entry=><tr>
            {headersList.map(col=> <td>{typeof entry[col.fieldId] !== 'object' ? entry[col.fieldId] : ""}</td>)}
          </tr>)}
      </tbody>
    </table>
    </>
  )
}

export default ModelView
