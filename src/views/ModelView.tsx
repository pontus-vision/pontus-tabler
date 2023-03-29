import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { cmsGetContentModel, listModel } from "../client";
import PVGridWebiny2 from "../pv-react/PVGridWebiny2";

const ModelView = () => {
  const { modelId } = useSelector((state) => state.model);
  const [entriesList, setEntriesList] = useState<any[]>();
  const [headersList, setHeadersList] = useState<any[]>();

  const getModelFields = async (modelId: string) => {
    const cmsContentModel = await cmsGetContentModel(modelId);

    const { fields } = cmsContentModel.data.data.getContentModel.data;

    
    const modelContentList = await listModel(modelId, fields);
    setEntriesList(modelContentList);

    // setHeadersList(modelContentList.map(model=>{
    //    const {createdOn, createdBy, id, ownedBy, savedOn, entryId, ...rest} = model
    //    return rest
    //  }))
    setHeadersList(fields);
  };
  useEffect(() => {
    getModelFields(modelId);
  }, [modelId]);

  useEffect(() => {
    console.log(entriesList);
  }, [entriesList]);

  useEffect(() => {
    console.log(headersList);
  }, [headersList]);

  return (
    <ModelViewStyles>
      <h1>{modelId}</h1>
     <PVGridWebiny2 headers={headersList} rows={entriesList}/>
    </ModelViewStyles>
  );
};

const ModelViewStyles = styled.div`
  
`

export default ModelView;
