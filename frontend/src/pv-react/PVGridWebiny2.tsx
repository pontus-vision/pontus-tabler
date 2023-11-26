import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  CellClickedEvent,
  ColDef,
  ColumnApi,
  ColumnState,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  IRowNode,
  IServerSideGetRowsParams,
  RowEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import PVAggridColumnSelector from '../components/PVAggridColumnSelector';
import { newRowState } from '../store/sliceGridUpdate';
import { _isClickEvent } from 'chart.js/dist/helpers/helpers.core';

import {
  ReadPaginationFilterFilters,
  User,
} from '../pontus-api/typescript-fetch-client-generated';
import GridActionsPanel from '../components/GridActionsPanel';

type FilterState = {
  [key: string]: any;
};

type Props = {
  id?: string;
  onValueChange?: (id: string, value: ColumnState[]) => void;
  modelId?: string;
  lastState?: ColumnState[];
  showColumnSelector?: boolean;
  setShowColumnSelector?: Dispatch<React.SetStateAction<boolean>>;
  deleteMode?: boolean;
  containerHeight?: string;
  updateMode?: boolean;
  setRowClicked?: Dispatch<SetStateAction<RowEvent<any, any> | undefined>>;
  cols: ColDef[];
  rows?: { [key: string]: any }[];
  totalCount?: number;
  add?: () => void;
  onParamsChange?: (params: IGetRowsParams) => void;
  onRefresh?: () => void;
  onDelete?: (arr: any[]) => void;
  onUpdate?: (data: any) => void;
  onRowClicked?: (row: RowEvent<any, any>) => void;
  permissions?: {
    updateAction: boolean;
    createAction: boolean;
    deleteAction: boolean;
    readAction: boolean;
  };
  onFiltersChange?: (filters: {
    [key: string]: ReadPaginationFilterFilters;
  }) => void;
  onFromChange?: (num: number) => void;
  onToChange?: (num: number) => void;
  setDeletion?: Dispatch<SetStateAction<boolean>>;
  setGridHeight?: Dispatch<React.SetStateAction<undefined | number>>;
  setEntriesToBeDeleted?: Dispatch<React.SetStateAction<any | undefined>>;
  testId?: string;
};

const PVGridWebiny2 = ({
  id,
  onValueChange,
  lastState,
  onRefresh,
  modelId,
  showColumnSelector,
  setShowColumnSelector,
  setRowClicked,
  cols,
  rows,
  add,
  totalCount,
  permissions,
  onDelete,
  onFiltersChange,
  onUpdate,
  onFromChange,
  onToChange,
  onRowClicked,
  setGridHeight,
  onParamsChange,
  testId,
}: Props) => {
  const [columnState, setColumnState] = useState<ColumnState[]>();
  const [filterState, setFilterState] = useState<ReadPaginationFilterFilters>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const [selectedRows, setSelectedRows] = useState<IRowNode<any>[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[] | undefined>([]);
  const [cursors, setCursors] = useState(new Set([null]));
  const [gridApi, setGridApi] = useState<GridApi>();
  const [cachedRowParams, setCachedRowParams] = useState<IGetRowsParams>();
  const [to, setTo] = useState();
  const [from, setFrom] = useState();
  const [deleteMode, setDeleteMode] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [entriesToBeDeleted, setEntriesToBeDeleted] = useState<IRowNode<any>[]>(
    [],
  );
  const [showGrid, setShowGrid] = useState(true);
  const [checkHiddenObjects, setCheckHiddenObjects] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState<
    Array<string | undefined>
  >([]);

  useEffect(() => {
    if (!columnState || !onValueChange || !id) return;
    // onValueChange(id, columnState);
  }, [columnState, id]);

  const paramsChange = () => {
    cachedRowParams && onParamsChange && onParamsChange(cachedRowParams);
  };

  useEffect(() => {
    paramsChange();
  }, [cachedRowParams]);

  const getDataSource = () => {
    const datasource: IDatasource = {
      getRows: async (params: IGetRowsParams) => {
        setCachedRowParams(params);

        if (!showGrid) return;

        try {
          const pageSize = params.endRow - params.startRow;

          const index = Math.floor(params.startRow / pageSize);

          const filter = params.filterModel;

          let sorting;

          if (params.sortModel.length > 0) {
            const colId = params?.sortModel[0].colId;
            const sort = params?.sortModel[0].sort;
            sorting = `${colId}_${sort.toUpperCase()}`;
          }

          onToChange && onToChange(params.endRow);
          onFromChange && onFromChange(params.startRow);

          // onFiltersChange && onFiltersChange(filter);

          setColumnDefs([
            {
              headerName: '',
              field: 'delete',

              checkboxSelection: true,
              width: 30,
              colId: 'delete-mode',
              sortable: false,
              filter: false,
              hide: true,
              suppressMovable: true,
              // cellRendererParams: {onChange: handleCheckboxChange,}
            },
            {
              headerName: '',
              field: 'update',
              cellStyle: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
              },
              width: 30,
              colId: 'update-mode',
              sortable: false,
              filter: false,
              hide: true,
              suppressMovable: true,
              cellRenderer: () => <i className="fa-solid fa-pen-to-square"></i>,
              onCellClicked: handleUpdateIconClick,
            },

            ...cols,
          ]);

          // ...data.columnNames.map((field) => {
          //   if (
          //     field.type === 'object' &&
          //     field.settings?.fields &&
          //     checkHiddenObjects === false
          //   ) {
          //     return {
          //       headerName: field.label,
          //       field: field.fieldId,
          //       children: field.settings?.fields.map((field) => {
          //         return {
          //           sortable: false,
          //           field: field.fieldId,
          //           headerName: field.label,
          //         };
          //       }),
          //     };
          //   } else if (field.type === 'ref') {
          //     return {
          //       headerName: field.label,
          //       field: field.fieldId,
          //       sortable: false,
          //     };
          //   }
          //   return {
          //     headerName: field.label,
          //     field: field.fieldId,
          //     filter: 'agTextColumnFilter',
          //     filterParams: { apply: true, newRowsAction: 'keep' },
          //   };
          // }),
          //   ...cols,
          // ]);

          // if (rows) {
          //   console.log({ rows });
          //   params.successCallback(rows, totalCount);
          // }
        } catch (error) {
          console.error(error);
        }
      },
    };
    return datasource;
  };

  useEffect(() => {
    if (!rows) return;
    // console.log({ rows, totalCount });
    cachedRowParams?.successCallback(rows, totalCount);
  }, [rows, filterState]);

  useEffect(() => {
    const objects = columnDefs?.filter(
      (el: { [key: string]: any }) => el?.children,
    );

    const checkHiddenObj =
      objects &&
      objects.length > 0 &&
      objects
        .map((obj: { [key: string]: any }) =>
          obj.children.every((child: { [key: string]: unknown }) =>
            columnState?.some((col) => child.field === col.colId && col.hide),
          ),
        )
        .every((el) => el === true);

    checkHiddenObj && setCheckHiddenObjects(true);

    if (checkHiddenObj) {
      setColumnDefs(
        (prevState) =>
          (prevState = prevState?.filter(
            (col) => !objects.some((obj) => obj === col),
          )),
      );
    }
  }, [columnState]);

  const handleUpdateIconClick = (params: CellClickedEvent<any, any>) => {
    const { data: rowData } = params;

    onUpdate && onUpdate(rowData);

    const { id, ...rest } = rowData;
  };
  useEffect(() => {
    gridApi?.refreshInfiniteCache();
  }, [rows]);

  const onGridReady = (params: GridReadyEvent<any>): void => {
    setGridApi(params.api);

    setColumnApi(params.columnApi);
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  };

  const gridOptions: GridOptions = {
    rowModelType: 'infinite',
    cacheBlockSize: 100,
    suppressRowClickSelection: true,

    onRowClicked: (e) => {
      onRowClicked && onRowClicked(e);
    },
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const datasource = useMemo<IDatasource>(() => {
    return getDataSource();
  }, [modelId]);

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

  const handleColumnSelect = (selectedColumns: Array<string | undefined>) => {
    setSelectedColumns(selectedColumns);
    setShowColumnSelector && setShowColumnSelector(false);
  };

  useEffect(() => {
    if (deleteMode) {
      columnApi?.setColumnVisible('delete-mode', true);
    } else {
      columnApi?.setColumnVisible('delete-mode', false);
      selectedRows.forEach((row) => {
        row.setSelected(false);
      });
    }
  }, [deleteMode]);

  useEffect(() => {
    if (updateMode) {
      columnApi?.setColumnVisible('update-mode', true);
    } else {
      columnApi?.setColumnVisible('update-mode', false);
    }
  }, [updateMode]);

  useEffect(() => {
    // if (columnApi && columnDefs) {
    //   columnDefs.forEach((columnDef) => {
    //     if (!columnDef.field) return;
    //     if (selectedColumns.includes(columnDef.field)) {
    //       columnApi.setColumnVisible(columnDef.field, true);
    //     } else {
    //       columnApi.setColumnVisible(columnDef.field, false);
    //     }
    //   });
    // }
  }, [columnApi, selectedColumns]);

  // const gridStyle = useMemo(() => ({ height: "25rem", width: "100%" }), []);
  function restoreGridColumnStates() {
    if (columnApi && lastState) {
      columnApi.applyColumnState({ state: lastState });
    }
  }

  useEffect(() => {
    restoreGridColumnStates();
    updateGridHeight();
  }, [columnDefs]);

  const onSelectionChanged = (event: SelectionChangedEvent): void => {
    const selectedRows = event.api.getSelectedNodes();

    setSelectedRows(selectedRows);
  };

  useEffect(() => {
    setEntriesToBeDeleted &&
      setEntriesToBeDeleted(selectedRows.map((row) => row.data));
  }, [selectedRows]);

  const gridContainerRef = useRef(null);

  const updateGridHeight = () => {
    const gridElement = document.querySelector(
      `.${gridId}.ag-theme-alpine`,
    ) as HTMLElement;
    if (gridElement) {
      const gridHeight = gridElement.offsetHeight;
      setGridHeight && setGridHeight(gridHeight);
    }
  };

  const [gridId, setGridId] = useState<string>();

  useEffect(() => {
    function generateRandomString(length: number) {
      let result = '';
      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const charactersLength = characters.length;

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
      }

      return result;
    }
    setGridId(generateRandomString(16));
  }, []);

  return (
    <>
      <div data-testid={testId} className={'ag-theme-alpine' + ' ' + gridId}>
        {columnDefs && (
          <PVAggridColumnSelector
            columnState={columnState}
            setShowColumnSelector={setShowColumnSelector}
            showColumnSelector={showColumnSelector}
            onColumnSelect={handleColumnSelect}
            columns={columnDefs}
          />
        )}
        <GridActionsPanel
          testId={`${testId}-panel`}
          add={add}
          permissions={permissions}
          onDelete={onDelete}
          deleteMode={deleteMode}
          onRefresh={onRefresh}
          updateMode={updateMode}
          setDeleteMode={setDeleteMode}
          setUpdateMode={setUpdateMode}
          entriesToBeDeleted={entriesToBeDeleted}
        />
        <AgGridReact
          data-testid="ag-grid-component"
          gridOptions={gridOptions}
          // enableRangeSelection={true}
          // paginationAutoPageSize={true}
          paginationPageSize={6}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onFilterChanged={handleGridStateChanged}
          onColumnMoved={handleGridStateChanged}
          onColumnResized={handleGridStateChanged}
          onColumnPinned={handleGridStateChanged}
          onColumnVisible={handleGridStateChanged}
          onSortChanged={handleGridStateChanged}
          domLayout="autoHeight"
          pagination={true}
          datasource={datasource}
          columnDefs={columnDefs}
          ref={gridContainerRef}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
        ></AgGridReact>
      </div>
    </>
  );
};

export default PVGridWebiny2;
