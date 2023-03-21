import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getContentModel, listModel } from "../client";

const ModelView = () => {
  const {modelId} = useSelector(state => state.model)
  const [modelList, setModelList] = useState<any[]>()
  const [headersList, setHeadersList] = useState<any[]>()

  const getModelFields = async(modelId: string) => {
    const contentModel = await getContentModel(modelId)
   console.log(contentModel, modelId) 

    const modelContentList = await listModel(modelId, contentModel.fields) 

    
   // setHeadersList(modelContentList.map(model=>{
   //    const {createdOn, createdBy, id, ownedBy, savedOn, entryId, ...rest} = model
   //    return rest
   //  }))
    setHeadersList(contentModel.fields)

    
  } 
  useEffect(()=>{
    getModelFields(modelId)
    

  },[modelId])

  useEffect(()=>{
    console.log(headersList)
  },[headersList])

  return(
    <>
    <h1>{modelId}</h1>
    <table className="table table-striped">
      <thead>
        <tr>
            {!!headersList && headersList.map(key=><th>{key.label}</th>)}
        </tr>
      </thead>
      <tbody>
        
      </tbody>
    </table>
    </>
  )
}

export default ModelView
