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
  RowEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { useDispatch } from 'react-redux';
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
  cols?: ColDef[];
  rows?: { [key: string]: unknown }[];
  totalCount?: number;
  add: () => void;
  onUpdate: (data: any) => void;
  setFilters?: Dispatch<
    SetStateAction<ReadPaginationFilterFilters | undefined>
  >;
  setFrom?: Dispatch<SetStateAction<number | undefined>>;
  setTo?: Dispatch<SetStateAction<number | undefined>>;
  setDeletion?: Dispatch<SetStateAction<User[] | undefined>>;
  setGridHeight?: Dispatch<React.SetStateAction<undefined>>;
  setEntriesToBeDeleted?: Dispatch<React.SetStateAction<any | undefined>>;
};

const PVGridWebiny2 = ({
  id,
  onValueChange,
  lastState,
  modelId,
  showColumnSelector,
  setShowColumnSelector,
  setRowClicked,
  cols,
  rows,
  add,
  totalCount,
  setDeletion,
  setFilters,
  onUpdate,
  setFrom,
  setTo,
  setEntriesToBeDeleted,
  setGridHeight,
}: Props) => {
  const [columnState, setColumnState] = useState<ColumnState[]>();
  const [filterState, setFilterState] = useState<FilterState>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const [selectedRows, setSelectedRows] = useState<IRowNode<any>[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[] | undefined>([]);
  const [cursors, setCursors] = useState(new Set([null]));
  const [gridApi, setGridApi] = useState<GridApi>();

  const [deleteMode, setDeleteMode] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);

  const [showGrid, setShowGrid] = useState(true);
  const [checkHiddenObjects, setCheckHiddenObjects] = useState(false);

  const dispatch = useDispatch();
  const [selectedColumns, setSelectedColumns] = useState<
    Array<string | undefined>
  >([]);

  useEffect(() => {
    if (!columnState || !onValueChange || !id) return;
    // onValueChange(id, columnState);
  }, [columnState, id]);

  // useEffect(() => {
  //   setColumnDefs(cols);
  // }, [cols]);

  const getDataSource = () => {
    const datasource: IDatasource = {
      getRows: async (params: IGetRowsParams) => {
        if (!showGrid) return;

        try {
          const pageSize = params.endRow - params.startRow;

          const index = Math.floor(params.startRow / pageSize);

          const filter = params.filterModel;

          console.log(filter);

          let sorting;

          if (params.sortModel.length > 0) {
            const colId = params?.sortModel[0].colId;
            const sort = params?.sortModel[0].sort;
            sorting = `${colId}_${sort.toUpperCase()}`;
          }

          setTo && setTo(params.endRow);
          setFrom && setFrom(params.startRow);

          setFilters && setFilters(filter);

          // const data = await getModelData(
          //   modelId,
          //   pageSize,
          //   [...cursors][index],
          //   filter,
          //   sorting,
          // );

          // if (!data) return;

          // setCursors((previousState) => previousState.add(data.meta.cursor));

          // const { totalCount } = data.meta;

          // const rows = data.modelContentListData.map(
          //   (row: IListModelResponseData): { [key: string]: unknown } => {
          //     const {
          //       createdBy,
          //       createdOn,
          //       entryId,
          //       ownedBy,
          //       savedOn,
          //       ...rest
          //     } = row;
          //     return rest;
          //   },
          // );

          // const objFields = data.columnNames.filter(
          //   (col) => col.type === 'object',
          // );

          // const refInputFields = data.columnNames.filter(
          //   (col) => col.renderer.name === 'ref-input',
          // );

          // const refInputsFields = data.columnNames.filter(
          //   (col) => col.renderer.name === 'ref-inputs',
          // );

          // const rows2 = rows.map((row) => {
          //   const flattenObj = (ob: { [key: string]: any }) => {
          //     let result = {} as any;
          //     for (const i in ob) {
          //       if (
          //         typeof ob[i] === 'object' &&
          //         !Array.isArray(ob[i]) &&
          //         objFields.some((field) => field.fieldId === i)
          //       ) {
          //         const temp = flattenObj(ob[i]);
          //         for (const j in temp) {
          //           // Store temp in result
          //           result[j] = temp[j];
          //         }
          //       } else if (
          //         refInputFields.some((field) => field.fieldId === i)
          //       ) {
          //         if (!!ob[i]) {
          //           result[i] = Object.values(ob[i])[0];
          //         }
          //       } else if (
          //         refInputsFields.some((field) => field.fieldId === i)
          //       ) {
          //         if (ob[i]) {
          //           const values = ob[i].map(
          //             (el: { [key: string]: unknown }) => Object.values(el)[0],
          //           );
          //           result[i] = values.length > 1 ? values.join(', ') : values;
          //         }
          //       } else {
          //         result[i] = ob[i];
          //       }
          //     }
          //     return result;
          //   };

          //   return flattenObj(row);
          // });

          // if (!cols) return;

          setColumnDefs([
            {
              headerName: '',
              field: 'delete',
              headerCheckboxSelection: true,
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
            ...cols,
          ]);

          if (rows) {
            params.successCallback(rows, totalCount);
          }
        } catch (error) {
          console.error(error);
        }
      },
    };
    return datasource;
  };

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

    onUpdate(rowData);

    const { id, ...rest } = rowData;

    dispatch(
      newRowState({
        tableId: modelId,
        rowId: rowData.id,
        rowState: rest,
      }),
    );
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
    cacheBlockSize: 1,
    suppressRowClickSelection: true,

    onRowClicked: (e) => {
      if (setRowClicked) {
        setRowClicked(e.data);
      }
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
    const gridElement = document.querySelector(`.${gridId}.ag-theme-alpine`);
    if (gridElement) {
      const gridHeight = gridElement.offsetHeight;
      setGridHeight && setGridHeight(gridHeight);
    }
  };

  const [gridId, setGridId] = useState<string>();

  useEffect(() => {
    function generateRandomString(length) {
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
      <div className={'ag-theme-alpine' + ' ' + gridId}>
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
          data-testid="grid-action-panel"
          add={add}
          setDeletion={setDeletion}
          deleteMode={deleteMode}
          updateMode={updateMode}
          setDeleteMode={setDeleteMode}
          setUpdateMode={setUpdateMode}
        />
        <AgGridReact
          data-testid="ag-grid-component"
          gridOptions={gridOptions}
          enableRangeSelection={true}
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
