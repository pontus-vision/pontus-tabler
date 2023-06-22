import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Actions,
  DockLocation,
  IJsonModel,
  IJsonRowNode,
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
import { useSelector } from "react-redux";
import NewEntryView from "../views/NewEntryView";
import { RootState } from "../store/store";
import { cmsDeleteEntry } from "../client";
import { useTranslation } from "react-i18next";
import DeleteEntriesModal from "../components/DeleteEntriesModal";

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

  const { rowState, rowId, modelId:updateModelId } = useSelector((state: RootState) => state.updateRow);
  const [model, setModel] = useState<Model>(Model.fromJson(initialJson));
  const [containerHeight, setContainerHeight] = useState("32rem");
  const [modelId, setModelId] = useState<string | undefined>()
  const [flexModelId, setFlexModelId] = useState<string>()
  const [aggridColumnsState, setAGGridColumnsState] = useState<ColumnState[]>()
  const [entriesToBeDeleted, setEntriesToBeDeleted] = useState<string[]>()
  const [deletion, setDeletion] = useState(false)
  const [openNewEntryView, setOpenNewEntryView] = useState(false)
  
  const { t } = useTranslation()

  const [updatedGrid, setUpdatedGrid] = useState<{modelId: string, key: number}>({
    modelId: "", 
    key: 0
  })

  useEffect(()=>{setOpenNewEntryView(true)},[updateModelId])

  useEffect(()=>{
    setModelId(updateModelId)
  },[updateModelId, rowId])

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = node.getConfig();
    const id = node.getId();
    
    
    if (component === "PVGridWebiny2") {
      const lastState = findChildById(gridState?.layout, id, "tab")?.config
      ?.lastState;

      const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);
      const [gridKey, setGridKey] = useState(0)
      const [deleteMode, setDeleteMode] = useState(false);
      const [updateMode, setUpdateMode] = useState(false);
      

      useEffect(()=>{
        const colState = findChildById(model.toJson().layout, id, "tab").config.lastState
        setAGGridColumnsState(colState)
        console.log({colState})
      },[model])

      useEffect(()=>{
        if(updatedGrid?.modelId === config.modelId) {
          setGridKey(prevState=> prevState = updatedGrid.key)
        }
      },[updatedGrid])

    
        
      return (
        <>
        <div className="tab-actions-panel" >
          {deleteMode || updateMode || <label className="tab-actions-panel__plus-btn" style={{ display:  "flex", alignItems: "center", padding: 0, cursor: "pointer", height: "2rem", fontSize: "4rem",  left: "8rem"}} 
            onClick={()=> {
              setFlexModelId(id)
              setOpenNewEntryView(true)
              setModelId(prevState=> updateModelId ? prevState = updateModelId : prevState = config.modelId)
            }}>+</label>}
            {updateMode || deleteMode ||<button onClick={()=>{
              setGridKey(prevState=> prevState + 1)
            }}>restore</button>} 
            {updateMode || deleteMode ||<button onClick={()=> {
              setShowColumnSelector(true)}}>Select Columns</button>}
            {updateMode || deleteMode || <button onClick={()=>setDeleteMode(!deleteMode)}>Delete Mode</button>}
            {updateMode || deleteMode || <button onClick={()=>{setUpdateMode(!updateMode)}}>Update Mode</button>}

            {deleteMode && <div style={{gap:"1rem" ,height: "2.65rem", display: "flex", alignItems: "center"}} className="tab-actions-panel__delete-actions">
              <i className="fa-solid fa-trash" onClick={()=> {
                setModelId(config.modelId)
                entriesToBeDeleted && entriesToBeDeleted.length > 0 && setDeletion(true)}}  style={{fontSize: "1.8rem", color: "#b53737", cursor: "pointer"}}></i>
              <i className="fa-solid fa-x" style={{fontSize: "1.8rem", cursor: "pointer"}} onClick={()=> setDeleteMode(false)}></i>         
            </div>}
            {updateMode && <div className="tab-actions-panel__update-actions">
              <i className="fa-solid fa-x" style={{fontSize: "1.8rem", cursor: "pointer", height: "2.65rem", display: "flex", alignItems: "center"}} onClick={()=> setUpdateMode(false)}></i>         
            </div>}
              
        </div>
          <PVGridWebiny2
            deleteMode={deleteMode}
            setShowColumnSelector={setShowColumnSelector}
            showColumnSelector={showColumnSelector}
            key={gridKey}
            id={id}
            lastState={lastState || config.lastState}
            onValueChange={handleValueChange}
            modelId={config.modelId}
            containerHeight={containerHeight}
            updateMode={updateMode}
            setEntriesToBeDeleted={setEntriesToBeDeleted}
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
        return layout.children;
      } else if (layout.children[0].type !== type) {
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

    setContainerHeight(tabsets.length * 32 + "rem"); // Increase height by 200px
   
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

    jsonCopy.layout.children.forEach((row: IJsonRowNode) => {
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
    {modelId && openNewEntryView && <NewEntryView setOpenNewEntryView={setOpenNewEntryView} setUpdatedGrid={setUpdatedGrid} aggridColumnsState={aggridColumnsState} flexModelId={flexModelId} setModelId={setModelId} modelId={modelId} />}
    {deletion && entriesToBeDeleted && modelId &&  <DeleteEntriesModal setDeletion={setDeletion} entries={entriesToBeDeleted} modelId={modelId} updateGridKey={setUpdatedGrid}/>}
    <div
      className="flex-layout-wrapper"
      style={{ height: "65vh", width: "90%", overflowY: "auto" }}
    >
      <div
        className="pv-flex-layout"
        style={{
          display: 'flex', 
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
