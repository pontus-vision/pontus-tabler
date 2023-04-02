import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { cmsGetContentModel, listModel } from "../client";
import PVGridWebiny2 from "../pv-react/PVGridWebiny2";
import AggridExample from '../components/Aggrid-teste'

const ModelView = () => {
  const {model} = useSelector((state) => state.model);
  const [entriesList, setEntriesList] = useState<any[]>([]);
  const [headersList, setHeadersList] = useState<any[]>([]);

  const getModelFields = async (modelId: string, limit: number, after: string | null) => {
    const cmsContentModel = await cmsGetContentModel(modelId);    
    const { fields } = cmsContentModel.data.data.getContentModel.data;
    const queryList = await listModel(modelId, fields, limit, after);
    console.log({queryList})
    setEntriesList(queryList)
    setHeadersList(fields);

    return {
      fields,
      queryList
    }
  }; 

  return (
    <ModelViewStyles>
      <h1>{model.name}</h1>
     <PVGridWebiny2 getModelFields={getModelFields} headers={headersList} rows={entriesList}/>
     <AggridExample /> 
    </ModelViewStyles>
  );
};

const ModelViewStyles = styled.div`
  
`

export default ModelView;
