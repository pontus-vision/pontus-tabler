import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { cmsGetContentModel, listModel } from "../client";
import PVGridWebiny2 from "../pv-react/PVGridWebiny2";
import { Routes, Route, Outlet } from "react-router-dom";
import AggridExample from "../components/Aggrid-teste";
import {
  ModelContentList,
  ModelColName,
  ModelContentListData,
  Meta,
} from "../types";
import Form from "../components/Form";
import { useParams } from "react-router-dom";
import GridExample from "../components/Aggrid-teste";
import ReactDOM from "react-dom";
import { Layout, Model, TabNode, IJsonModel } from "flexlayout-react";
import PVFlexLayout from "../pv-react/FlexLayout";

export type GetModelFieldsReturn = {
  columnNames: ModelColName[];
  modelContentListData: ModelContentListData[];
  meta: Meta;
};

var json: IJsonModel = {
  global: { tabEnableClose: false },
  borders: [
    {
      type: "border",
      location: "bottom",
      size: 100,
      children: [
        {
          type: "tab",
          name: "four",
          component: "text",
        },
      ],
    },
    {
      type: "border",
      location: "left",
      size: 100,
      children: [],
    },
  ],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 50,
        selected: 0,
        children: [
          {
            type: "tab",
            name: "One",
            component: "text",
          },
        ],
      },
      {
        type: "tabset",
        weight: 50,
        selected: 0,
        children: [
          {
            type: "tab",
            name: "Two",
            component: "text",
          },
          {
            type: "tab",
            name: "Three",
            component: "text",
          },
        ],
      },
    ],
  },
};
const ModelView = () => {
  const { model } = useSelector((state) => state.model);
  const [entriesList, setEntriesList] = useState<any[]>([]);
  const [headersList, setHeadersList] = useState<any[]>([]);
  const { modelId } = useParams();
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const getModelFields = async (
    modelId: string,
    limit: number,
    after: string | null,
    fieldsSearches = null
  ) => {
    const cmsContentModel = await cmsGetContentModel(modelId);

    const { fields: columnNames } =
      cmsContentModel.data.data.getContentModel.data;
    const { data: modelContentListData, meta } = await listModel(
      modelId,
      columnNames,
      limit,
      after,
      fieldsSearches
    );

    // console.log({ columnNames });

    return { columnNames, modelContentListData, meta };
  };

  const modelLayout = Model.fromJson(json);

  // useEffect(() => {
  //   setShowGrid(false);
  //   setTimeout(() => {
  //     setShowGrid(true);
  //   }, 1);
  // }, [modelId]);

  const factory = (node: TabNode) => {
    var component = node.getComponent();
    if (component === "button") {
      return <button>{node.getName()}</button>;
    }
  };

  return (
    <>
      <ModelViewStyles>
        <h1>{model.name}</h1>
        <label onClick={() => setIsFormLoaded(true)}>Nova Entrada</label>
        {/* {showGrid && ( */}
        {/*   <PVGridWebiny2 */}
        {/*     headers={headersList} */}
        {/*     rows={entriesList} */}
        {/*     getModelFields={getModelFields} */}
        {/*   /> */}
        {/* )} */}
        <div className="layout">
          <PVFlexLayout
            rows={entriesList}
            headers={headersList}
            getModelFields={getModelFields}
          />
        </div>

        {/* <div ref={containerRef} style={{ width: "100%", height: "100vh" }}></div> */}
        {/* <Layout model={modelLayout} factory={factory} />       */}
        {/* {isFormLoaded && <Form />} */}
        {/* <Outlet  /> */}
      </ModelViewStyles>
    </>
  );
};

const ModelViewStyles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .layout {
    position: relative;
    top: 0rem;
    height: 30rem;
    width: 90%;
  }
`;

export default ModelView;
