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
  CellValueChangedEvent,
  ColDef,
  ColumnApi,
  ColumnState,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IDatasource,
  IGetRowsParams,
  IRowNode,
  RowClickedEvent,
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
import { deepEqual } from '../../utils';
import { AiOutlineSelect } from 'react-icons/ai';

type FilterState = {
  [key: string]: any;
};

type Props = {
  onRowsStateChange?: (data: Record<string, any>[]) => void;
  isLoading?: boolean;
  id?: string;
  cypressAtt?: string;
  onValueChange?: (id: string, value: ColumnState[]) => void;
  modelId?: string;
  lastState?: ColumnState[];
  onColumnState?: (cols: ColumnState[]) => void;
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
  selection?: boolean;
  selectRowByCell?: boolean;
  permissions?: {
    updateAction?: boolean;
    createAction?: boolean;
    deleteAction?: boolean;
    readAction?: boolean;
  };
  onCreateRow?: (e: Record<string, any>) => void
  onUpdateRow?: (e: Record<string, any>) => void
  onCellsChange?: (data: CellValueChangedEvent[]) => void;
  onFiltersChange?: (filters: {
    [key: string]: ReadPaginationFilterFilters;
  }) => void;
  onCellValueChange?: (cell: CellValueChangedEvent) => void;
  onCellClicked?: (e: CellClickedEvent<any, any>) => void;
  rowsSelected?: IRowNode<any>[];
  onRowsSelected?: (e: IRowNode<any>[]) => void;
  onFromChange?: (num: number) => void;
  onToChange?: (num: number) => void;
  setGridHeight?: Dispatch<React.SetStateAction<undefined | number>>;
  setEntriesToBeDeleted?: Dispatch<React.SetStateAction<any | undefined>>;
  testId?: string;
  resetRowsChangedState?: boolean;
  updateModeOnRows?: boolean;
  paginationPageSize?: number
  addRowOnEditMode?: boolean
  editOnGrid?: boolean
};

const PVGridWebiny2 = ({
  id,
  isLoading,
  onRowsStateChange,
  resetRowsChangedState,
  onValueChange,
  onCellsChange,
  lastState,
  onRefresh,
  modelId,
  setRowClicked,
  cols,
  rows,
  rowsSelected,
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
  onRowsSelected,
  onColumnState,
  onCellClicked,
  onCellValueChange,
  selection,
  selectRowByCell,
  testId,
  cypressAtt,
  updateModeOnRows,
  paginationPageSize = 6,
  addRowOnEditMode = true,
  onCreateRow,
  onUpdateRow,
  editOnGrid = true
}: Props) => {
  const [deleteMode, setDeleteMode] = useState(false);
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
  const [editMode, setEditMode] = useState(false)
  const [rowStateHasChanged, setRowsStateHasChanged] = useState(false);
  // const [deleteMode, setDeleteMode] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [entriesToBeDeleted, setEntriesToBeDeleted] = useState<IRowNode<any>[]>(
    [],
  );
  const [showGrid, setShowGrid] = useState(true);
  const [checkHiddenObjects, setCheckHiddenObjects] = useState(false);
  const [columns, setColumns] = useState<ColDef[]>(cols)

  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [initialRows, setInitialRows] = useState<string>();
  const [rowsAlterations, setRowsAlterations] = useState<
    CellValueChangedEvent[]
  >([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const gridContainerRef = useRef<AgGridReact>(null);
  const [valueChanged, setValueChanged] = useState(false)

  useEffect(() => {
    if (!columnState || !onValueChange || !id) return;
    // onValueChange(id, columnState);
  }, [columnState, id]);

  const emitRowAlterations = () => {
    const alterations = rowsAlterations.filter((row) => {
      if (!initialRows) return;
      return !JSON.parse(initialRows).some((row2: Record<string, any>) =>
        deepEqual(row, row2),
      );
    });

    rowsAlterations && setRowsStateHasChanged(alterations.length > 0);
    if (alterations.length > 0) {
      setRowsStateHasChanged(true)
      onRowsStateChange && rowsAlterations && onRowsStateChange(alterations);
    } else {
      setRowsStateHasChanged(false)
      onRowsStateChange && rowsAlterations && onRowsStateChange(alterations);
    }
  }

  useEffect(() => {
    emitRowAlterations()
  }, [rowsAlterations]);

  useEffect(() => {
    if (!editMode) {
      setRowsAlterations([])
    }
  }, [editMode])

  useEffect(() => {
    if (!resetRowsChangedState) return;
    setRowsAlterations([]);
  }, [resetRowsChangedState]);

  const paramsChange = () => {
    cachedRowParams && onParamsChange && onParamsChange(cachedRowParams);
  };

  useEffect(() => {
    paramsChange();
    selectRows();
    if (editMode && addRowOnEditMode) {
      addNewEmptyRow()
    }
  }, [cachedRowParams]);

  useEffect(() => {
    if (editMode && addRowOnEditMode) {
      addNewEmptyRow()
    }
  }, [columnState]);

  useEffect(() => {
    onColumnState && columnState && onColumnState(columnState);
  }, [columnState]);

  const selectRows = () => {
    gridApi?.forEachNode((node) => {
      if (rowsSelected?.some((row) => row.data?.id === node.data?.id)) {
        node.setSelected(true);
      }
    });
  };

  useEffect(() => {
    selectRows();
  }, [rows]);

  useEffect(() => {
    if (isLoading) {
      gridContainerRef.current!?.api?.showLoadingOverlay();
    } else {
      gridContainerRef.current!?.api?.hideOverlay();
    }
  }, [isLoading]);

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
              field: 'select',
              checkboxSelection: true,
              width: 30,
              colId: 'selection-mode',
              sortable: false,
              filter: false,
              hide: true,
              suppressMovable: true,
              cellAriaRole: `${cypressAtt}-select`,
              // cellRendererParams: {onChange: handleCheckboxChange,}
            },
            {
              field: 'click',
              cellStyle: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
              },
              width: 30,
              colId: 'click',
              sortable: false,
              filter: false,
              hide: true,
              suppressMovable: true,

              cellRenderer: (e: ICellRendererParams) => {
                return (
                  <div>
                    <AiOutlineSelect />
                  </div>
                );
              },
              onCellClicked: handleUpdateIconClick,
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

              cellRenderer: (e: ICellRendererParams) => {
                return (
                  <i
                    data-testid={`${testId}-update-row-btn`}
                    className="fa-solid fa-pen-to-square"
                    data-cy="update-row-icon-pen"
                  ></i>
                );
              },
              onCellClicked: handleUpdateIconClick,
            },

            ...columns,
          ].sort((a, b) => a?.pivotIndex - b?.pivotIndex)
            .map(colDef => {
              //   if (colDef?.regex) {
              //     const re = new RegExp(colDef?.regex)
              //     return {
              //       ...colDef, valueGetter: e => {
              //         if (re.test(e?.data?.[e?.colDef?.colId])) {
              //           //return 'wrong format'
              //         }
              //       }
              //     }
              //  }
              const kind = colDef?.kind
              if (kind === 'checkboxes') {
                return { ...colDef, cellEditor: "agCheckboxCellEditor", cellRenderer: 'agCheckboxCellRenderer', }

              }
              return colDef
            })
          );

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
    console.log({ ROWS: rows, cols: gridApi?.getColumnDefs() })
    cachedRowParams?.successCallback(rows, totalCount);
  }, [rows, filterState, cachedRowParams]);

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
  };

  useEffect(() => {
    gridApi?.refreshInfiniteCache();
    setInitialRows(JSON.stringify(rows));
  }, [rows]);

  const onGridReady = (params: GridReadyEvent<any>): void => {
    setGridApi(params.api);

    setColumnApi(params.columnApi);

    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  };

  function onBtShowLoading() {
    gridApi!.showLoadingOverlay();
  }

  const gridOptions: GridOptions = {
    rowModelType: 'infinite',
    cacheBlockSize: 100,
    suppressRowClickSelection: true,
  };

  // const defaultColDef = useMemo<ColDef>(() => {
  //   return {
  //     filter: true,
  //     sortable: true,
  //     resizable: true,
  //   };
  // }, []);

  const datasource = useMemo<IDatasource>(() => {
    return getDataSource();
  }, [modelId]);

  function onFilterChanged() {
    if (gridApi) {
      onFiltersChange && onFiltersChange(gridApi.getFilterModel());
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

  useEffect(() => {
    console.log({ cols })
  }, [cols])

  const handleColumnSelect = (cols: Array<string | undefined>) => {
    const hidden = columnState
      ?.filter((colState) => !cols.some((col) => colState.colId === col))
      ?.map((col) => col.colId);

    if (hidden) {
      gridApi?.setColumnsVisible(hidden, false);
    }

    !cols.some((col) => col === undefined) &&
      gridApi?.setColumnsVisible(cols as string[], true);
  };

  const handleEditOnGrid = (val: boolean) => {
    console.log({ editOnGrid })
    if (!editOnGrid) return
    setEditMode(val)
    setColumnDefs(prevState => prevState.map((col) => {
      const isNotEditable = col.field === 'id' || col.field === 'delete' || col.field === 'select' || col.field === 'click'
      return { ...col, editable: isNotEditable ? false : val }
      const index = cols.findIndex(el => el.field === col.field)
      console.log({ index })
      if (index === -1) return col
      if (cols[index]?.editable === false) return col
      return { ...col, editable: isNotEditable ? false : !col?.editable }
    }))
    gridApi.setGridOption("columnDefs", columnDefs)
    if (!val) {
      gridApi.stopEditing(true)
    }
  }

  const [rowsState, setRowsState] = useState<{ [key: string]: any }[]>(rows)
  const [gridTotalCount, setGridTotalCount] = useState<number>()
  const addNewEmptyRow = () => {
    if (totalCount === 1 && rows.length === 0) {
      console.log({ rows })
      return
    }
    const newRow = {}
    for (const columnDef of columnDefs) {
      newRow[columnDef.field] = ''
    }

    //rows.push(newRow)
    console.log({ newRow, rowsState, totalCount })
    if (Array.isArray(rows)) {
      setRowsState([...rows, newRow])
    }
    setGridTotalCount((totalCount || 1) + 1)
    console.log({ rowsState, totalCount: totalCount || 1 })
    cachedRowParams?.successCallback(rowsState, totalCount || 1);
  }


  useEffect(() => {
    if (!addRowOnEditMode) return
    addNewEmptyRow()
  }, [editMode])



  useEffect(() => {
    if (!rows) return
    if (!editMode) {
      cachedRowParams?.successCallback(rows, totalCount);
    } else {
      cachedRowParams?.successCallback(rowsState, gridTotalCount || 1);
    }
  }, [rowsState])

  useEffect(() => {
    console.log({ editOnGrid })
    if (!gridApi?.setGridOption || !editOnGrid) return
    console.log({ rows })
    const toggleBtn: HTMLInputElement = document.querySelector('.switch > input')
    console.log({ toggleBtn })
    setColumnDefs(prevState => prevState.map((col) => {
      const isNotEditable = col.field === 'id' || col.field === 'delete' || col.field === 'select' || col.field === 'click'
      return { ...col, editable: isNotEditable ? false : editMode }
      const index = cols.findIndex(el => el.field === col.field)
      console.log({ index })
      if (index === -1) return col
      if (cols[index]?.editable === false) return col
      return { ...col, editable: isNotEditable ? false : !col?.editable }
    }))
    gridApi.setGridOption("columnDefs", columnDefs)
    console.log({ columnDefs })
    if (!editMode) {
      gridApi.stopEditing(true)
    }
  }, [cachedRowParams])

  useEffect(() => {
    console.log({ rows })
  }, [rows])

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
    setColumnState(gridApi?.getColumnState());
  }, [gridApi]);

  // const gridStyle = useMemo(() => ({ height: "25rem", width: "100%" }), []);
  function restoreGridColumnStates() {
    if (columnApi && lastState) {
      columnApi.applyColumnState({ state: lastState });
    }
  }

  useEffect(() => {
    restoreGridColumnStates();
    updateGridHeight();

    if (selectRowByCell) {
      columnApi?.setColumnVisible('click', true);
      gridApi?.setColumnVisible('click', true);
    }

    if (selection) {
      columnApi?.setColumnVisible('selection-mode', true);
      gridApi?.setColumnVisible('selection-mode', true);
      // gridApi?.setColumnsVisible(['selection-mode'], true);
    } else {
      columnApi?.setColumnVisible('selection-mode', false);
      // selectedRows.forEach((row) => {
      //   row.setSelected(false);
      // });
    }
  }, [columnDefs]);

  const onSelectionChanged = (event: SelectionChangedEvent): void => {
    const selectedRows = event.api.getSelectedNodes();
    onRowsSelected && onRowsSelected(selectedRows);

    setSelectedRows(selectedRows);
  };

  useEffect(() => { }, []);

  useEffect(() => {
    setEntriesToBeDeleted &&
      setEntriesToBeDeleted(selectedRows.map((row) => row.data));
  }, [selectedRows]);

  const updateGridHeight = () => {
    const gridElement = document.querySelector(
      `.${gridId}.ag-theme-alpine`,
    ) as HTMLElement;
    if (gridElement) {
      const gridHeight = gridElement.offsetHeight;
      setGridHeight && setGridHeight(gridHeight);
    }
  };
  const [cellsChanged, setCellsChanged] = useState<CellValueChangedEvent[]>([]);



  const onCellValueChanged = (cell: CellValueChangedEvent) => {

    onCellValueChange && onCellValueChange(cell);

    setCellsChanged([...cellsChanged, cell]);

    setValueChanged(true)

    setRowsAlterations((prevState) => [...new Set([...prevState, cell.data])]);
  };

  useEffect(() => {
    onCellsChange && onCellsChange(cellsChanged);
  }, [cellsChanged]);

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

  const handleOnUpdate = () => {
    onUpdate && onUpdate(rowsAlterations);
    setRowsAlterations([]);
  };

  const defaultColDef = useMemo(() => {
    return {
      width: 170,
      filter: true,
    };
  }, []);

  const createOnEnter = (e: RowClickedEvent) => {
    if (e.event?.key !== 'Enter') return
    if (e.data.id && onUpdateRow) {
      onUpdateRow(e.data)
    }


    if (!e.data?.id || onCreateRow) {
      delete e.data.create
      delete e.data.update
      delete e.data.select
      delete e.data.click
      delete e.data.delete

      onCreateRow && onCreateRow(e.data)
      //onRowsStateChange([e.data])
      //emitRowAlterations()
    }
  }

  return (
    <>
      <div
        data-cy={cypressAtt}
        style={{ width: '100%', height: '100%', position: 'relative' }}
        data-testid={testId}
        data-cy="read-tables-aggrid"
        className={'ag-theme-alpine' + ' ' + gridId}
      >
        {cols && (
          <PVAggridColumnSelector
            columnState={columnState}
            setShowColumnSelector={setShowColumnSelector}
            showColumnSelector={showColumnSelector}
            onColumnSelect={handleColumnSelect}
            columns={cols}
          />
        )}
        <GridActionsPanel
          testId={`${testId}-panel`}
          add={add}
          permissions={permissions}
          onDelete={onDelete}
          setShowColumnSelector={setShowColumnSelector}
          deleteMode={deleteMode}

          onRefresh={onRefresh}
          updateModeOnRows={updateModeOnRows}
          changesMade={valueChanged}
          onUpdate={handleOnUpdate}
          updateMode={updateMode}
          setDeleteMode={setDeleteMode}
          setUpdateMode={setUpdateMode}
          entriesToBeDeleted={entriesToBeDeleted}
          onEditOnGrid={handleEditOnGrid}
        />
        <AgGridReact
          data-testid="ag-grid-component"
          gridOptions={gridOptions}
          onRowClicked={(e) => {
            if (
              !e.api.getColumn('update-mode')?.isVisible() &&
              !e.api.getColumn('delete-mode')?.isVisible()
            ) {
              if (editMode) return
              onRowClicked && onRowClicked(e);
            }
          }}
          // enableRangeSelection={true}
          // paginationAutoPageSize={true}
          onCellClicked={(e) => { if (editMode) return; onCellClicked && onCellClicked(e) }}
          paginationPageSize={paginationPageSize}
          defaultColDef={defaultColDef}
          rowSelection={'multiple'}
          rowMultiSelectWithClick={true}
          onGridReady={onGridReady}
          onFilterChanged={handleGridStateChanged}
          onSelectionChanged={onSelectionChanged}
          onCellValueChanged={onCellValueChanged}
          onColumnMoved={handleGridStateChanged}
          onColumnResized={handleGridStateChanged}
          onColumnPinned={handleGridStateChanged}
          onColumnVisible={handleGridStateChanged}
          onSortChanged={handleGridStateChanged}
          domLayout="autoHeight"
          onCellKeyDown={e => {
            createOnEnter(e)
          }}
          pagination={true}
          datasource={datasource}
          paginationPageSizeSelector={false}
          columnDefs={columnDefs}
          ref={gridContainerRef}
        // onSelectionChanged={onSelectionChanged}
        // onCellValueChanged={(e) => console.log({ e })}
        ></AgGridReact>
      </div>
    </>
  );
};

export default PVGridWebiny2;
