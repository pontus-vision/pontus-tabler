import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Actions,
  DockLocation,
  IJsonModel,
  IJsonTabNode,
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
import NewEntryView from "../views/NewEntryView";

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
  dashboardId
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
  const [containerHeight, setContainerHeight] = useState("30rem");
  const [modelId, setModelId] = useState<string | undefined>()
  const [flexModelId, setFlexModelId] = useState<string>()
  const [aggridColumnsState, setAGGridColumnsState] = useState<ColumnState[]>()

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = node.getConfig();
    const id = node.getId();
    
    if (component === "PVGridWebiny2") {
      const lastState = findChildById(gridState?.layout, id, "tab")?.config
      ?.lastState;
      
      
      return (
        <>
          <i style={{ cursor: "pointer", fontSize: "2rem", position: "absolute", left: "8rem"}} className="fa-solid fa-plus"
            onClick={()=> {
              setFlexModelId(id)
              const colState = findChildById(model.toJson().layout, id, "tab").config.lastState
              setAGGridColumnsState(colState)
              setModelId(prevState=> prevState = config.modelId)
            }}></i>
          <PVGridWebiny2
            id={id}
            lastState={lastState || config.lastState}
            onValueChange={handleValueChange}
            modelId={config.modelId}
          />
        </>
      );
    }
    if (component === "PVDoughnutChart2") {
      return <PVDoughnutChart2 />;
    }

    return null;
  };

  const findChildById = (layout: any, id: string, type: string): any => {
    if (layout?.type === type && layout.id === id) {
      return layout;
    }

    if (layout?.children) {
      for (const child of layout.children) {
        const result = findChildById(child, id, type);
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

    // setAGGridColumnsState(newValue)

    const json = model.toJson();

    const jsonCopy = JSON.parse(JSON.stringify(json));

    const tab = findChildById(jsonCopy.layout, id, "tab");

    if (tab) {
      tab.config.lastState = newValue;
      setModel(Model.fromJson(jsonCopy));
    }
  };

  const filterComponentsPerType = (layout:any, type: string):any => {
    if (layout?.children && layout.children.length > 0) {
      if (layout.children[0].type === type) {
        console.log(layout.children);
        return layout.children;
      } else if (layout.children[0].type !== type) {
        console.log(layout.children);
        return filterComponentsPerType(layout.children[0], type);
      }
    }
    return null;
  };

  const onModelChange = () => {
    if (setIsEditing) {
      setIsEditing(true);
    }
    if (setGridState) {
      setGridState(model.toJson());
    }
    const rootNode = model.getRoot();

    const tabsets = filterComponentsPerType(rootNode.toJson(), "tabset");

    const children = rootNode.toJson().children[0].children;

    const childrenNum = children.length;

    console.log({ tabsets });

    setContainerHeight(tabsets.length * 30 + "rem"); // Increase height by 200px
    // setContainerHeight(
    //   model.getRoot().getChildren()[0].getRect().height + "px"
    // );

    console.log(
      containerHeight,
      tabsets.length,
      rootNode.getChildren()[0].getRect().height
    );
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

    if (rootNode) {
      model.doAction(
        Actions.addNode(aggridCmp, rootNode.getId(), DockLocation.BOTTOM, 0)
      );
      setModel(Model.fromJson(model.toJson()));
    }

    const json = model.toJson();

    const jsonCopy = JSON.parse(JSON.stringify(json));

    jsonCopy.layout.children.forEach((row) => {
      row.weight = 100;
      const { type } = row;
      // console.log({ type });
      row.children.forEach((tabset, index) => {
        const { type } = tabset;
        // console.log({ type });
        tabset.weight = 100;
      });
    });

    // console.log({ jsonCopy, newJson });

    setModel(Model.fromJson(jsonCopy));
  };

  // useEffect(() => {
  //   const lastGridState = JSON.parse(localStorage.getItem("layoutState") || "");

  //   if (lastGridState) {
  //     setModel(Model.fromJson(lastGridState));
  //   }
  // }, []);

  const filterColumns = (cols: ColumnState[]) => {

    const colsFiltered = contentModel?.fields.filter(field => !cols.some(col=> col.colId === field.fieldId))
    console.log(colsFiltered)
  
  }

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
    console.log({ model, gridState });
  }, [gridState]);

  useEffect(()=>{
    console.log({containerHeight})
  },[containerHeight])

  useEffect(()=>{
    if(!flexModelId) return
    const flexModel = findChildById(model.toJson().layout , flexModelId, "tab")
    
    console.log(flexModel)
  },[flexModelId])

  return (
    <>
    {modelId && <NewEntryView aggridColumnsState={aggridColumnsState} columnsState={flexModelId} setModelId={setModelId} modelId={modelId} />}

    <div
      className="flex-layout-wrapper"
      style={{ height: "65vh", width: "90%", overflowY: "auto" }}
    >
      <div
        className="PVFlexLayout"
        style={{
          height: `${containerHeight}`,
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
        </>
  );
};

export default PVFlexLayout;
