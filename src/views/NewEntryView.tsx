import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cmsGetContentModel } from "../client";
import NewEntryForm from "../components/NewEntryForm";
import { ICmsGetContentModelData } from "../types";
import styled from "styled-components";
import Form from "react-bootstrap/esm/Form";
import Alert from "react-bootstrap/esm/Alert";
import NewEntryFormSkeleton from "../components/skeleton/NewEntryFormSkeleton";

type Props = {
  modelId: string
  setModelId: Dispatch<SetStateAction<string | undefined>>
}

const NewEntryView = ({modelId, setModelId}:Props) => {
  const [contentModel, setContentModel] = useState<ICmsGetContentModelData>();
  const [successMsg, setSuccessMsg] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  

  const getModelContent = async (modelId: string) => {
    try {
      setIsLoading(true)
      const { data } = await cmsGetContentModel(modelId);
      setIsLoading(false)
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

  return <NewEntryViewStyles >
    {modelId && <div className="shadow" onClick={()=>setModelId("")}></div>}
    {contentModel && <Form.Label className="new-entry new-entry-form__title">{contentModel?.name}</Form.Label>}
    {isLoading ? <NewEntryFormSkeleton /> : (contentModel && <NewEntryForm contentModel={contentModel} setSuccessMsg={setSuccessMsg} />)}
      {successMsg && <Alert className="success-msg" variant="success"> {successMsg} </Alert>}
    </NewEntryViewStyles>;
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
    width: 30rem;
    text-align: right:
    z-index: 3;
  }
  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    background-color: #0000004b;
    /* pointer-events: none;  */
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
