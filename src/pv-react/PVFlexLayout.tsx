import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
// import './App.css';
import {
  Actions,
  DockLocation,
  IJsonModel,
  IJsonTabNode,
  IJsonTabSetNode,
  ILayoutProps,
  ILayoutState,
  Layout,
  Model,
  TabNode,
} from "flexlayout-react";
import "flexlayout-react/style/light.css";
import PVGridWebiny2 from "./PVGridWebiny2";
import { ColumnState } from "ag-grid-community";
import { FlexLayoutCmp, WebinyModel } from "../types";
import PVDoughnutChart2 from "./PVDoughnutChart2";

type Props = {
  gridState?: IJsonModel;
  selectedCmp?: FlexLayoutCmp;
  setGridState?: Dispatch<SetStateAction<IJsonModel | undefined>>;
};

const PVFlexLayout = ({ selectedCmp, setGridState, gridState }: Props) => {
  const initialJson: IJsonModel = {
    global: {},
    borders: [],
    layout: {
      type: "row",
      children: [],
    },
  };

  const [model, setModel] = useState<Model>(Model.fromJson(initialJson));

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = node.getConfig();
    const id = node.getId();
    if (component === "PVGridWebiny2") {
      const lastState = findTabById(gridState?.layout, id)?.config?.lastState;
      return (
        <PVGridWebiny2
          id={id}
          lastState={lastState || config.lastState}
          onValueChange={handleValueChange}
          modelId={config.modelId}
        />
      );
    }
    if (component === "PVDoughnutChart2") {
      return <PVDoughnutChart2 />;
    }

    return null;
  };

  const findTabById = (layout: any, id: string): any => {
    console.log({ layout });
    if (layout?.type === "tab" && layout.id === id) {
      return layout;
    }

    if (layout?.children) {
      for (const child of layout.children) {
        const result = findTabById(child, id);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  const handleValueChange = (id: string, newValue: ColumnState[]) => {
    const json = model.toJson();

    const jsonCopy = JSON.parse(JSON.stringify(json));

    const tab = findTabById(jsonCopy.layout, id);

    if (tab) {
      tab.config.lastState = newValue;
      setModel(Model.fromJson(jsonCopy));
    }
  };

  const onModelChange = () => {
    if (!setGridState) return;
    setGridState(model.toJson());
  };

  const addComponent = (entry: FlexLayoutCmp) => {
    const aggridCmp: IJsonTabNode = {
      type: "tab",
      name: entry.cmp?.name || entry.componentName,
      component: entry.componentName,
      config: {
        title: entry.cmp?.name,
        modelId: entry.cmp?.modelId,
        lastState: [],
      },
    };
    // model.doAction(Actions.addNode(aggridCmp, "1", DockLocation.CENTER, 0));
    const rootNode = model.getRoot();
    const firstTabsetNode = rootNode
      .getChildren()
      .find((child) => child.getType() === "tabset");

    if (firstTabsetNode) {
      model.doAction(
        Actions.addNode(aggridCmp, firstTabsetNode.getId(), DockLocation.TOP, 0)
      );
      setModel(Model.fromJson(model.toJson()));
    }
  };

  useEffect(() => {
    const lastGridState = JSON.parse(localStorage.getItem("layoutState") || "");

    if (lastGridState) {
      console.log({ lastGridState });
      setModel(Model.fromJson(lastGridState));
    }
  }, []);

  useEffect(() => {
    if (!selectedCmp) return;
    console.log({ selectedCmp });
    addComponent(selectedCmp);
  }, [selectedCmp]);

  useEffect(() => {
    if (!setGridState) return;
    setGridState(model.toJson());
  }, [model]);

  useEffect(() => {
    if (!gridState) return;
    setModel(Model.fromJson(gridState));
  }, [gridState]);

  return (
    <div className="PVFlexLayout">
      <Layout onModelChange={onModelChange} model={model} factory={factory} />
    </div>
  );
};

export default PVFlexLayout;
