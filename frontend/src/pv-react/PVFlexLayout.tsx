import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Actions,
  DockLocation,
  IJsonModel,
  IJsonRowNode,
  IJsonTabNode,
  IJsonTabSetNode,
  Layout,
  Model,
  TabNode,
} from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import PVGridWebiny2 from './PVGridWebiny2';
import { ColDef, ColumnState } from 'ag-grid-community';
import { FlexLayoutCmp } from '../types';
import PVDoughnutChart2 from './PVDoughnutChart2';
import { useSelector } from 'react-redux';
import NewEntryView from '../views/NewEntryView';
import { RootState } from '../store/store';
import { useTranslation } from 'react-i18next';
import DeleteEntriesModal from '../components/DeleteEntriesModal';
import GridActionsPanel from '../components/GridActionsPanel';
import { tableRead, tableDataRead } from '../client';
import { ReadPaginationFilter } from '../pontus-api/typescript-fetch-client-generated';
import { TableDataReadReq } from '../typescript/api';

type Props = {
  gridState?: IJsonModel;
  setDeletion?: Dispatch<SetStateAction<undefined>>;
  deletion: boolean;
  selectedCmp?: FlexLayoutCmp;
  setIsEditing?: Dispatch<React.SetStateAction<boolean>>;
  dashboardId?: string;
  setGridState?: Dispatch<SetStateAction<IJsonModel | undefined>>;
  permissions?: {
    updateAction: boolean;
    createAction: boolean;
    deleteAction: boolean;
    readAction: boolean;
  };
  onLayoutChange?: () => void
};

const PVFlexLayout = ({
  selectedCmp,
  setGridState,
  gridState,
  setIsEditing,
  dashboardId,
  setDeletion,
  deletion,
  permissions,
  onLayoutChange
}: Props) => {
  const initialJson: IJsonModel = {
    global: {},
    borders: [],
    layout: {
      type: 'row',
      children: [],
    },
  };

  const {
    rowState,
    rowId,
    tableId: updateTableId,
  } = useSelector((state: RootState) => state.updateRow);

  const [model, setModel] = useState<Model>(Model.fromJson(initialJson));
  const [containerHeight, setContainerHeight] = useState('32rem');
  const [tableId, setTableId] = useState<string | undefined>();
  const [flexModelId, setFlexModelId] = useState<string>();
  const [aggridColumnsState, setAGGridColumnsState] = useState<ColumnState[]>();
  const [entriesToBeDeleted, setEntriesToBeDeleted] = useState<string[]>();
  const [openNewEntryView, setOpenNewEntryView] = useState(false);

  const { t } = useTranslation();

  const [updatedGrid, setUpdatedGrid] = useState<{
    modelId: string;
    key: number;
  }>({
    modelId: '',
    key: 0,
  });

  useEffect(() => {
    if (!updateTableId) return;
    setOpenNewEntryView(true);
  }, [updateTableId]);

  useEffect(() => {
    setTableId(updateTableId);
  }, [updateTableId, rowId]);

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = node.getConfig();
    const id = node.getId();

    if (component === 'PVGridWebiny2') {
      const lastState = findChildById(gridState?.layout, id, 'tab')?.config
        ?.lastState;

      const [showColumnSelector, setShowColumnSelector] =
        useState<boolean>(false);
      const [gridKey, setGridKey] = useState(0);
      const [deleteMode, setDeleteMode] = useState(false);
      const [updateMode, setUpdateMode] = useState(false);
      const [gridHeight, setGridHeight] = useState();

      const [cols, setCols] = useState<ColDef[]>([]);
      const [rows, setRows] = useState<{ [key: string]: unknown }[]>();
      const [filters, setFilters] = useState<ReadPaginationFilter>();
      const [from, setFrom] = useState<number>();
      const [to, setTo] = useState<number>();
      const [totalCount, setTotalCount] = useState<number>();
      useEffect(() => {
        const colState = findChildById(model.toJson().layout, id, 'tab').config
          .lastState;
        setAGGridColumnsState(colState);
      }, [model]);

      useEffect(() => {
        if (updatedGrid?.modelId === config.modelId) {
          setGridKey((prevState) => (prevState = updatedGrid.key));
        }
      }, [updatedGrid]);

      useEffect(() => {
        const json = model.toJson();

        const jsonCopy = JSON.parse(JSON.stringify(json));

        const tab = findChildById(jsonCopy.layout, id, 'tab');

        if (tab) {
          tab.config.height = gridHeight;
          setModel(Model.fromJson(jsonCopy));
        }
      }, [gridHeight]);

      useEffect(() => {
        const fetchTable = async () => {
          const input: TableDataReadReq = {
            to: 20,
            from: 1,
            filters: {},
            tableName: config.title
          };
          const colsRes = await tableRead({ id: config.tableId });

          const colsData = colsRes?.data;

          // setRows(data.records?.map((record) => JSON?.parse(record)));
          colsData?.cols && setCols(colsData?.cols);
          const readDataTableRes = await tableDataRead(input);
          const dataTableData = readDataTableRes?.data;

          // data?.records &&
          //   // setRows(data.records?.map((record) => JSON?.parse(record)));
          //   setRows(
          //     data.records.map((rec) => {
          //       return { field: rec };
          //     }),
          //   );
          setTotalCount(readDataTableRes.data.rowsCount || 2);
        };

        fetchTable();
      }, [config]);

      if (cols.length > 0) {
        return (
          <>
            <PVGridWebiny2
              setGridHeight={setGridHeight}
              deleteMode={deleteMode}
              setShowColumnSelector={setShowColumnSelector}
              showColumnSelector={showColumnSelector}
              key={gridKey}
              id={id}
              cols={cols}
              permissions={permissions}
              totalCount={totalCount}
              setDeletion={setDeletion}
              rows={rows}
              lastState={lastState || config.lastState}
              onValueChange={handleValueChange}
              modelId={selectedCmp?.cmp?.tableId}
              containerHeight={containerHeight}
              updateMode={updateMode}
              setEntriesToBeDeleted={setEntriesToBeDeleted}
            />
          </>
        );
      }
    }
    if (component === 'PVDoughnutChart2') {
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

    const tab = findChildById(jsonCopy.layout, id, 'tab');

    if (tab) {
      tab.config.lastState = newValue;
      setModel(Model.fromJson(jsonCopy));
    }
  };

  const calcContainerHeight = () => {
    if (!model) return;

    const rootNode = model.getRoot();
    const tabsets = filterComponentsPerType(rootNode.toJson(), 'tabset');

    const tabsetsHeight = tabsets.map((tabset) => {
      const tabsetSelected = tabset?.selected;
      if (tabsetSelected) {
        return tabset.children[tabsetSelected]?.config?.height;
      } else if (!tabsetSelected) {
        return tabset.children[0]?.config?.height;
      }
    });

    const totalHeight = tabsetsHeight.reduce((acc, cur) => {
      acc += cur;
      return acc;
    }, 0);

    return tabsets.length * 100 + totalHeight + 'px';
  };

  useEffect(() => {
    setContainerHeight(calcContainerHeight() || '400px');
  }, [model]);

  const filterComponentsPerType = (layout: any, type: string): any => {
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
    onLayoutChange && onLayoutChange()

    if (setIsEditing) {
      setIsEditing(true);
    }
    if (setGridState) {
      setGridState(model.toJson());
    }
    const rootNode = model.getRoot();

    const tabsets = filterComponentsPerType(rootNode.toJson(), 'tabset');

    const children = rootNode.toJson().children[0].children;

    const childrenNum = children.length;

    setContainerHeight(calcContainerHeight() || '400px');
  };

  const addComponent = (entry: Record<string, any>) => {
    const aggridCmp: IJsonTabNode = {
      type: 'tab',
      name: entry.cmp?.name || entry.componentName,
      component: entry.componentName,
      config: {
        title: entry.cmp?.name,
        tableId: entry.cmp?.id as string,
        lastState: [],
      },
    };

    const rootNode = model.getRoot();

    if (rootNode) {
      model.doAction(
        Actions.addNode(aggridCmp, rootNode.getId(), DockLocation.BOTTOM, 0),
      );
      setModel(Model.fromJson(model.toJson()));
    }

    const json = model.toJson();

    const jsonCopy = JSON.parse(JSON.stringify(json));

    jsonCopy.layout.children.forEach((row: IJsonRowNode) => {
      row.weight = 100;
      const { type } = row;
      row.children.forEach((tabset, index) => {
        const { type } = tabset;
        tabset.weight = 100;
      });
    });

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
  }, [gridState]);

  useEffect(() => {
    if (!flexModelId) return;
    const flexModel = findChildById(model.toJson().layout, flexModelId, 'tab');
  }, [flexModelId]);

  return (
    <>
      {(tableId || updateTableId) && openNewEntryView && (
        <NewEntryView
          setOpenNewEntryView={setOpenNewEntryView}
          setUpdatedGrid={setUpdatedGrid}
          aggridColumnsState={aggridColumnsState}
          flexModelId={flexModelId}
          setModelId={setTableId}
          modelId={tableId}
        />
      )}
      {deletion &&
        entriesToBeDeleted &&
        entriesToBeDeleted.length &&
        tableId && (
          <DeleteEntriesModal
            setDeletion={setDeletion}
            entries={entriesToBeDeleted}
            modelId={tableId}
            updateGridKey={setUpdatedGrid}
          />
        )}
      <div
        className="flex-layout-wrapper"
        style={{ height: '65vh', width: '90%', overflowY: 'auto' }}
      >
        <div
          className="pv-flex-layout"
          style={{
            display: 'flex',
            height: `${containerHeight}`,
            width: '100%',
            position: 'relative',
            overflowY: 'auto',
            flexGrow: 1,
            flexDirection: 'column',

          }}
        >
          <Layout
            onModelChange={onModelChange}
            model={model}
            factory={factory}
          />
        </div>
      </div>
    </>
  );
};

export default PVFlexLayout;
