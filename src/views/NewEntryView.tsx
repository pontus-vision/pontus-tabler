import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cmsGetContentModel } from "../client";
import NewEntryForm from "../components/NewEntryForm";
import { ICmsGetContentModelData } from "../types";

const NewEntryView = () => {
  const { modelId } = useParams();
  const [contentModel, setContentModel] = useState<ICmsGetContentModelData>();

  const getModelContent = async (modelId: string) => {
    try {
      const { data } = await cmsGetContentModel(modelId);
      console.log(data.fields.reduce((acc, cur)=> {
        (acc[cur.renderer.name] = acc[cur.renderer.name] || []).push(cur)
      
        return acc
      },{}));
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

  return <>{contentModel && <NewEntryForm contentModel={contentModel} />}</>;
};

export default NewEntryView;
