import {
  Children,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";
import {
  ColDef,
  ColumnApi,
  ColumnState,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  IGroupCellRendererParams,
  IServerSideDatasource,
  PaginationChangedEvent,
  SideBarDef,
} from "ag-grid-community";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GetModelFieldsReturn } from "../views/AdminView";
import {
  AgGrigFirstDataRenderedEvent,
  CmsEntriesList,
  CmsEntriesListContent,
  ModelContentListData,
} from "../types";
import {
  cmsGetContentModel,
  getEntry,
  listModel,
  searchEntries,
} from "../client";

type FilterState = {
  [key: string]: any;
};

type Props = {
  title: string;
  onValueChange: (title: string, value: ColumnState[]) => void;
  modelId: string;
  lastState?: ColumnState[];
};

const PVGridWebiny2 = ({ title, onValueChange, lastState, modelId }: Props) => {
  const [columnState, setColumnState] = useState<ColumnState[]>();
  const [filterState, setFilterState] = useState<FilterState>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const [columnDefs, setColumnDefs] = useState<ColDef[] | undefined>();
  const [cursors, setCursors] = useState(new Set([null]));
  const [indexPage, setIndexPage] = useState<number>(0);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [showGrid, setShowGrid] = useState(true);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const { model } = useSelector((state: any) => state.model);
  const [rowData, setRowData] = useState([]);

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
  useEffect(() => {
    if (columnApi) {
      columnApi.applyColumnState({ state: lastState });
    }
  }, []);

  useEffect(() => {
    if (!columnState) return;
    onValueChange(title, columnState);
  }, [columnState, title, onValueChange]);

  const getDataSource = () => {
    const datasource: IDatasource = {
      getRows: async (params: IGetRowsParams) => {
        if (!showGrid) return;

        try {
          const pageSize = params.endRow - params.startRow;

          const index = Math.floor(params.startRow / pageSize);

          const filter = params.filterModel;

          if (!modelId) return;

          if (Object.values(filter)[0]) {
            const fieldId = Object.keys(filter)[0];

            console.log({ filter });
            const filterInput = filter[fieldId].filter;

            // console.log({ modelId, pageSize, cursors, filterInput, fieldId });

            const data = (await getModelFields(
              modelId,
              pageSize,
              [...cursors][index],
              filter
            )) as GetModelFieldsReturn;
            // console.log(data);

            const rows = data.modelContentListData.map((row) => {
              const {
                createdBy,
                createdOn,
                entryId,
                id,
                ownedBy,
                savedOn,
                ...rest
              } = row;
              return rest;
            });

            setCursors(new Set([null]));
            setRowData([]);

            setCursors((previousState) => previousState.add(data.meta.cursor));

            params.successCallback(rows, data.meta.totalCount);
            return;
          }

          const data = (await getModelFields(
            modelId,
            pageSize,
            [...cursors][index]
          )) as GetModelFieldsReturn;

          setCursors((previousState) => previousState.add(data.meta.cursor));

          const { totalCount } = data.meta;

          const rows = data.modelContentListData.map((row) => {
            const {
              createdBy,
              createdOn,
              entryId,
              id,
              ownedBy,
              savedOn,
              ...rest
            } = row;
            return rest;
          });

          setColumnDefs(
            data.columnNames.map((field) => {
              return {
                headerName: field.label,
                field: field.fieldId,
                filter: "agTextColumnFilter",
                filterParams: { apply: true, newRowsAction: "keep" },
              };
            })
          );
          params.successCallback(rows, totalCount);
        } catch (error) {
          console.error(error);
        }
      },
    };
    return datasource;
  };

  useEffect(() => {
    restoreGridColumnStates();
  }, [columnApi]);

  const onGridReady = (params: GridReadyEvent<any>): void => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  };

  function onFilterChanged() {
    if (gridApi) {
      setFilterState(gridApi.getFilterModel());
    }
  }

  function onColumnMoved() {
    if (columnApi) {
      setColumnState(columnApi.getColumnState());
    }
  }

  const handleGridStateChanged = () => {
    onColumnMoved();
    onFilterChanged();
  };

  function onFirstDataRendered(params: AgGrigFirstDataRenderedEvent) {}

  const gridOptions: GridOptions = {
    rowModelType: "infinite",
    // onPaginationChanged: (e: PaginationChangedEvent) => {
    //   // console.log(
    //   //   `Pagination Event: ${JSON.stringify(e.api.getLastDisplayedRow())}`
    //   // );
    // },
    cacheBlockSize: 100,
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      // flex: 1,
      // sortable: true,
      filter: true,
    };
  }, []);

  const datasource = useMemo<IDatasource>(() => {
    return getDataSource();
  }, [modelId]);

  function restoreGridColumnStates() {
    console.log("restoreGridColumnStates called:\n ", { columnApi, lastState });

    if (columnApi) {
      console.log({ columnApi, lastState });
      columnApi.applyColumnState({ state: lastState });
    }
  }

  return (
    <>
      <div style={gridStyle} className="ag-theme-alpine">
        <button onClick={restoreGridColumnStates}>
          Restore Grid Column States
        </button>
        <AgGridReact
          enableRangeSelection={true}
          paginationAutoPageSize={true}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onFilterChanged={handleGridStateChanged}
          onColumnMoved={handleGridStateChanged}
          onColumnResized={handleGridStateChanged}
          onColumnPinned={handleGridStateChanged}
          onColumnVisible={handleGridStateChanged}
          onSortChanged={handleGridStateChanged}
          onFirstDataRendered={onFirstDataRendered}
          pagination={true}
          gridOptions={gridOptions}
          datasource={datasource}
          // maxConcurrentDatasourceRequests={1}
          columnDefs={columnDefs}
        ></AgGridReact>
      </div>
      ￼
    </>
  );
};

export default PVGridWebiny2;
