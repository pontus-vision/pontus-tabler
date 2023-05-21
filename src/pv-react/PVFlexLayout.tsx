import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Actions,
  DockLocation,
  IJsonModel,
  IJsonTabNode,
  IJsonTabSetNode,
  Layout,
  Model,
  TabNode,
} from "flexlayout-react";
import "flexlayout-react/style/light.css";
import PVGridWebiny2 from "./PVGridWebiny2";
import { ColumnState } from "ag-grid-community";
import { FlexLayoutCmp } from "../types";
import PVDoughnutChart2 from "./PVDoughnutChart2";
import { useDispatch } from "react-redux";

type Props = {
  gridState?: IJsonModel;
  selectedCmp?: FlexLayoutCmp;
  setIsEditing?: Dispatch<React.SetStateAction<boolean>>;
  dashboardId?: string;
  setGridState?: Dispatch<SetStateAction<IJsonModel | undefined>>;
};

const PVFlexLayout = ({
  selectedCmp,
  setGridState,
  gridState,
  setIsEditing,
  dashboardId,
}: Props) => {
  const initialJson: IJsonModel = {
    global: {},
    borders: [],
    layout: {
      type: "row",
      children: [],
    },
  };

  const dispatch = useDispatch();
  const [model, setModel] = useState<Model>(Model.fromJson(initialJson));
  const [containerHeight, setContainerHeight] = useState(30);

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
    if (setIsEditing) {
      setIsEditing(true);
    }

    const json = model.toJson();

    const jsonCopy = JSON.parse(JSON.stringify(json));

    const tab = findTabById(jsonCopy.layout, id);

    if (tab) {
      tab.config.lastState = newValue;
      setModel(Model.fromJson(jsonCopy));
    }
  };

  const [childrenNum, setChildrenNum] = useState<number>();

  const onModelChange = () => {
    if (setIsEditing) {
      setIsEditing(true);
    }
    if (setGridState) {
      setGridState(model.toJson());
    }
    const rootNode = model.getRoot();

    const childrenNum = rootNode.toJson().children[0].children.length;
    setChildrenNum(childrenNum);

    if (!!childrenNum && childrenNum > 0) {
      setContainerHeight(childrenNum * 30); // Increase height by 200px
    }

    console.log(model.toJson());
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
    const rootNode = model.getRoot();

    console.log({ childrenNum });
    if (rootNode) {
      model.doAction(
        Actions.addNode(aggridCmp, rootNode.getId(), DockLocation.BOTTOM, 0)
      );
      setModel(Model.fromJson(model.toJson()));
    }
  };

  // useEffect(() => {
  //   const lastGridState = JSON.parse(localStorage.getItem("layoutState") || "");

  //   if (lastGridState) {
  //     setModel(Model.fromJson(lastGridState));
  //   }
  // }, []);

  useEffect(() => {
    if (!selectedCmp) return;
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
    <div
      className="flex-layout-wrapper"
      style={{ height: "30rem", width: "90%", overflowY: "auto" }}
    >
      <div
        className="PVFlexLayout"
        style={{
          height: `${containerHeight}rem`,
          width: "100%",
          position: "relative",
          overflowY: "auto",
          flexGrow: 1,
          flexDirection: "column",
        }}
      >
        <Layout onModelChange={onModelChange} model={model} factory={factory} />
      </div>
    </div>
  );
};

export default PVFlexLayout;
