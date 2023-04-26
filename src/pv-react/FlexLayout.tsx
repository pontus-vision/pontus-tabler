import React, { useEffect, useState } from "react";
// import './App.css';
import { Layout, Model } from "flexlayout-react";
import "flexlayout-react/style/light.css";
import PVGridWebiny2 from "./PVGridWebiny2";
import { ColumnState } from "ag-grid-community";

const initialJson = {
  global: {},
  borders: [],
  layout: {
    type: "row",
    children: [
      {
        type: "tabset",
        children: [
          {
            type: "tab",
            name: "Component 1",
            component: "PVGridWebiny2",
            config: { title: "Component 1", lastState: {} },
          },
        ],
      },
      {
        type: "tabset",
        children: [
          {
            type: "tab",
            name: "Component 2",
            component: "PVGridWebiny2",
            config: { title: "Component 2", lastState: {} },
          },
        ],
      },
    ],
  },
};

const PVFlexLayout: React.FC = ({ headers, rows, getModelFields }) => {
  const [model, setModel] = useState<Model>(Model.fromJson(initialJson));

  useEffect(() => {
    const savedJson = localStorage.getItem("layoutState");
    if (savedJson) {
      setModel(Model.fromJson(JSON.parse(savedJson)));
    }
  }, []);

  const factory = (node: any) => {
    const component = node.getComponent();
    const config = node.getConfig();
    if (component === "PVGridWebiny2") {
      return (
        <PVGridWebiny2
          title={config.title}
          lastState={config.lastState}
          onValueChange={handleValueChange}
          getModelFields={getModelFields}
        />
      );
    }
    return null;
  };

  const findTabByTitle = (layout: any, title: string): any => {
    if (layout.type === "tab" && layout.config.title === title) {
      return layout;
    }

    if (layout.children) {
      for (const child of layout.children) {
        const result = findTabByTitle(child, title);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  const handleValueChange = (title: string, newValue: ColumnState[]) => {
    const json = model.toJson();
    const tab = findTabByTitle(json.layout, title);
    if (tab) {
      tab.config.lastState = newValue;
      localStorage.setItem("layoutState", JSON.stringify(json));
    }
  };

  const saveLayoutState = () => {
    const json = model.toJson();
    localStorage.setItem("layoutState", JSON.stringify(json));
  };

  const onModelChange = () => {
    saveLayoutState();
  };

  return (
    <div className="PVFlexLayout">
      <Layout onModelChange={onModelChange} model={model} factory={factory} />
    </div>
  );
};

export default PVFlexLayout;
