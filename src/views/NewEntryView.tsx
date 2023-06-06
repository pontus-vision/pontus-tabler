import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cmsGetContentModel } from "../client";
import NewEntryForm from "../components/NewEntryForm";
import { ICmsGetContentModelData } from "../types";
import styled from "styled-components";

type Props = {
  modelId: string
  setModelId: Dispatch<SetStateAction<string | undefined>>
}

const NewEntryView = ({modelId, setModelId}:Props) => {
  const [contentModel, setContentModel] = useState<ICmsGetContentModelData>();

  const getModelContent = async (modelId: string) => {
    try {
      const { data } = await cmsGetContentModel(modelId);
      console.log(data.fields.reduce((acc, cur)=> {
        (acc[cur.renderer.name] = acc[cur.renderer.name] || []).push(cur)
      
        return acc
      },{} as any));
      setContentModel(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (modelId) {
      console.log({ modelId });
      getModelContent(modelId);
    }
  }, [modelId]);

  return <NewEntryViewStyles onClick={()=>setModelId("")}>{contentModel && <NewEntryForm contentModel={contentModel} />}</NewEntryViewStyles>;
};

const NewEntryViewStyles = styled.div`
  position: absolute;
  width: 100%;
  height: 90%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow-y: auto;
  .new-entry__form {
    background: #e4e4e4;
    margin: auto;
    width: 70%;
  }
  .fa-solid{
    
  }
`

export default NewEntryView;
