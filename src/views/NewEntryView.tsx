import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cmsGetContentModel } from "../client";
import NewEntryForm from "../components/NewEntryForm";
import { ICmsGetContentModelData } from "../types";
import styled from "styled-components";
import Form from "react-bootstrap/esm/Form";
import Alert from "react-bootstrap/esm/Alert";
import NewEntryFormSkeleton from "../components/skeleton/NewEntryFormSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ColumnState } from "ag-grid-community";
import { selectCount } from "../store/slice";
import { newRowState, selectRowState } from '../store/sliceGridUpdate';

type Props = {
  modelId: string
  flexModelId?: string
  setModelId: Dispatch<SetStateAction<string | undefined>>
  aggridColumnsState: ColumnState[] | undefined
  setUpdatedGrid: Dispatch<React.SetStateAction<{
    modelId: string;
    key: number;
  } | undefined>>
}

const NewEntryView = ({modelId, setModelId, flexModelId, aggridColumnsState, setUpdatedGrid}:Props) => {
  const [contentModel, setContentModel] = useState<ICmsGetContentModelData>();
  const [successMsg, setSuccessMsg] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const { rowState, modelId:updateModelId, rowId } = useSelector((state: RootState) => state.updateRow);
  const dispatch = useDispatch()

  const [fieldsRendered, setFieldsRendered] = useState(false)

  const getModelContent = async (modelId: string) => {
    try {
      setIsLoading(true)
      const { data } = await cmsGetContentModel(modelId);
      setIsLoading(false)
      // console.log(data.fields.reduce((acc, cur)=> {
      //   (acc[cur.renderer.name] = acc[cur.renderer.name] || []).push(cur)
      
      //   return acc
      // },{} as any));

      
        const filteredFields = data?.fields.filter(field=> !aggridColumnsState?.some(col=> !field?.validation?.some(valid=> valid.name === 'required') &&  col.colId === field.fieldId && col.hide))
        
        const newContentModel = {
          ...data,
          name: data?.name,
          fields: filteredFields 
        }
        setContentModel(newContentModel)
     

    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatedGrid = () => {
    setUpdatedGrid(prevState => prevState = {modelId, key: prevState ? prevState?.key + 1 : 0})
  }

  useEffect(()=> {
    if(!aggridColumnsState) return
    
  },[aggridColumnsState])

  
  useEffect(() => {

    if (modelId ) {
      getModelContent(modelId);
    }
  }, [modelId]);

  

  return (
      <NewEntryViewStyles>
        {modelId && <div className="shadow" onClick={()=>{
          setModelId("")
          dispatch(newRowState({modelId: undefined, rowId: undefined, rowState: undefined}))
         }}></div>}
        {contentModel && <Form.Label className="new-entry new-entry-form__title">{contentModel?.name}</Form.Label>}
        
        {(contentModel  && <NewEntryForm isLoading={isLoading} setIsloading={setIsLoading} handleUpdatedGrid={handleUpdatedGrid}  contentModel={contentModel} setSuccessMsg={setSuccessMsg} />)}
        {successMsg && <Alert className="success-msg" variant="success"> {successMsg} </Alert>}
        <NewEntryFormSkeleton isLoading={isLoading} />
      </NewEntryViewStyles>
    )
};

const NewEntryViewStyles = styled.div`
  position: absolute;
  display: flex;
  padding: 2rem 0;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  .new-entry-form{
    position: relative;
    padding: 1rem;
    margin: auto;
    width: 35rem;
    z-index: 5;
    border-radius: .3rem;
    &__title {
      background: white;
      width: fit-content;
      z-index: 3;
      padding-inline: 1rem;
      margin-inline: auto;
      height: 2.2rem;
      display: flex;
      align-items: center;
      font-size: 1.8rem;
    }
  }
  .success-msg{
    position: absolute;
    width: 15rem;
    text-align: right;
    
    z-index: 1;
    bottom: 5rem;
  }
  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: #0000004b;
  }
   
  .skimmer {
    position: relative;
      padding: 1rem;
      margin: auto;
      width: 25rem;
      z-index: 5;

    &__line {
      height: 10px;
      width: 100%;
      background-color: lightgray;
      border-radius: 5px;
    }
  }
`

export default NewEntryView;
