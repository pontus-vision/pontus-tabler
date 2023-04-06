import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { cmsGetContentModel, listModel } from "../client";
import PVGridWebiny2 from "../pv-react/PVGridWebiny2";
import AggridExample from "../components/Aggrid-teste";
import {
  ModelContentList,
  ModelColName,
  ModelContentListData,
  Meta,
} from "../types";

export type GetModelFieldsReturn = {
  columnNames: ModelColName[];
  modelContentListData: ModelContentListData[];
  meta: Meta;
};

const ModelView = () => {
  const { model } = useSelector((state) => state.model);
  const [entriesList, setEntriesList] = useState<any[]>([]);
  const [headersList, setHeadersList] = useState<any[]>([]);

  const getModelFields: Promise<GetModelFieldsReturn> = async (
    modelId: string,
    limit: number,
    after: string | null
  ) => {
    const cmsContentModel = await cmsGetContentModel(modelId);
    console.log({modelId, cmsContentModel})
    const { fields: columnNames } =
      cmsContentModel.data.data.getContentModel.data;
    const { data: modelContentListData, meta } = await listModel(
      modelId,
      columnNames,
      limit,
      after
    );

    console.log({ columnNames });

    return { columnNames, modelContentListData, meta };
  };

  useEffect(() => {
    // console.log(model, model.modelId)
    // getModelFields(model.modelId, 9, n);
  }, [model]);

  useEffect(() => {
    console.log(entriesList);
  }, [entriesList]);

  useEffect(() => {
    console.log(headersList);
  }, [headersList]);

  return (
    <ModelViewStyles>
      <h1>{model.name}</h1>
      <PVGridWebiny2
        headers={headersList}
        rows={entriesList}
        getModelFields={getModelFields}
      />
      {/* <AggridExample />  */}
    </ModelViewStyles>
  );
};

const ModelViewStyles = styled.div``;

export default ModelView;
