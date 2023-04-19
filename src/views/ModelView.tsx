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
import GoldenLayout from "golden-layout";

export type GetModelFieldsReturn = {
  columnNames: ModelColName[];
  modelContentListData: ModelContentListData[];
  meta: Meta;
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
    console.log({ modelId, cmsContentModel });
    const { fields: columnNames } =
      cmsContentModel.data.data.getContentModel.data;
    const { data: modelContentListData, meta } = await listModel(
      modelId,
      columnNames,
      limit,
      after,
      fieldsSearches
    );

    console.log({ columnNames });

    return { columnNames, modelContentListData, meta };
  };

  useEffect(() => {
    console.log(modelId);
    // getModelFields(model.modelId, 9, n);
  }, [modelId]);

  useEffect(() => {
    console.log(entriesList);
  }, [entriesList]);

  useEffect(() => {
    console.log(headersList);
  }, [headersList]);
  useEffect(() => {
    setShowGrid(false);
    setTimeout(() => {
      setShowGrid(true);
    }, 1);
  }, [modelId]);

  useEffect(() => {
    if (containerRef.current) {
      const config: GoldenLayout.Config = {
        content: [
          {
            type: "row",
            content: [
              {
                type: "component",
                componentName: "MyComponent",
                title: "Component 1",
                componentState: { title: "Component 1" },
              },
              {
                type: "component",
                componentName: "MyComponent",
                title: "Component 2",
                componentState: { title: "Component 2" },
              },
            ],
          },
        ],
      };

      const layout = new GoldenLayout(config, containerRef.current);

      layout.registerComponent("MyComponent", (container, state) => {
        container.getElement().html(`<div id="${state.title}"></div>`);
        const el = document.getElementById(state.title);
        if (el) {
          ReactDOM.render(
            <PVGridWebiny2
              headers={headersList}
              rows={entriesList}
              getModelFields={getModelFields}
            />,
            el
          );
        }
      });

      layout.init();

      return () => {
        layout.destroy();
      };
    }
  }, []);

  return (
    <ModelViewStyles>
      <h1>{model.name}</h1>
      <label onClick={() => setIsFormLoaded(true)}>Nova Entrada</label>
      {showGrid && (
        <PVGridWebiny2
          headers={headersList}
          rows={entriesList}
          getModelFields={getModelFields}
        />
      )}
      <div ref={containerRef} style={{ width: "100%", height: "100vh" }}></div>

      {isFormLoaded && <Form />}
      {/* <Outlet  /> */}
    </ModelViewStyles>
  );
};

const ModelViewStyles = styled.div``;

export default ModelView;
