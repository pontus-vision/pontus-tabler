import { Dispatch, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
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
  SelectionChangedEvent,
} from "ag-grid-community";
import { AgGrigFirstDataRenderedEvent } from "../types";
import { cmsGetContentModel, listModel } from "../client";
import { useDispatch, useSelector } from "react-redux";
import NewEntryView from "../views/NewEntryView";
import PVAggridColumnSelector from "../components/PVAggridColumnSelector";
import { newRowState } from "../store/sliceGridUpdate";
import { _isClickEvent } from "chart.js/dist/helpers/helpers.core";

type FilterState = {
  [key: string]: any;
};

type Props = {
  id: string;
  onValueChange: (id: string, value: ColumnState[]) => void;
  modelId: string;
  lastState?: ColumnState[];
  showColumnSelector: boolean
  setShowColumnSelector: Dispatch<React.SetStateAction<boolean>>
  deleteMode: boolean
  updateMode: boolean
  setEntriesToBeDeleted:  Dispatch<React.SetStateAction<string[] | undefined>>
};

const CustomCellRenderer = ({ rowData, handleIconClick }) => {
  const handleClick = () => {
    handleIconClick(rowData);
  };

  return (
    <i className="fa-solid fa-pen-to-square" onClick={handleClick}></i>
  );
};

const PVGridWebiny2 = ({ id, onValueChange, lastState, modelId, showColumnSelector, setShowColumnSelector, deleteMode, updateMode, setEntriesToBeDeleted }: Props) => {
  const [columnState, setColumnState] = useState<ColumnState[]>();
  const [filterState, setFilterState] = useState<FilterState>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const [selectedRows, setSelectedRows] = useState<IRowNode<any>[]>([])
  const [columnDefs, setColumnDefs] = useState<ColDef[] | undefined>([]);
  const [cursors, setCursors] = useState(new Set([null]));
  const [gridApi, setGridApi] = useState<GridApi>();
  const [showGrid, setShowGrid] = useState(true);
  const gridStyle = useMemo(() => ({ height: "27rem", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const dispatch = useDispatch()
  const [selectedColumns, setSelectedColumns] = useState<Array<string | undefined>>([]);


  const getModelFields = async (
    modelId: string,
    limit: number,
    after: string | null,
    fieldsSearches = null
  ) => {
    const cmsContentModel = await cmsGetContentModel(modelId);

    const { fields: columnNames } = cmsContentModel.data;
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
    if (!columnState) return;
    onValueChange(id, columnState);
  }, [columnState, id]);


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
            const filterInput = filter[fieldId].filter;

            // console.log({ modelId, pageSize, cursors, filterInput, fieldId });

            const data = await getModelFields(
              modelId,
              pageSize,
              [...cursors][index],
              filter
            );
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

          const data = await getModelFields(
            modelId,
            pageSize,
            [...cursors][index]
          );

          setCursors((previousState) => previousState.add(data.meta.cursor));

          const { totalCount } = data.meta;

          const rows = data.modelContentListData.map((row) => {
            const {
              createdBy,
              createdOn,
              entryId,
              ownedBy,
              savedOn,
              ...rest
            } = row;
            return rest;
          })

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
              alignItems: "center",
              justifyContent: "center",
              fontSize: '1.3rem',
            },
            width: 30,
            colId: 'update-mode',
            sortable: false,
            filter: false,
            hide: true,
            suppressMovable: true,
            cellRenderer: () => <i className="fa-solid fa-pen-to-square"></i>,
            onCellClicked: handleUpdateIconClick
          },
            ...data.columnNames.map((field) => {
              return {
                headerName: field.label,
                field: field.fieldId,
                filter: "agTextColumnFilter",
                filterParams: { apply: true, newRowsAction: "keep" },
              };
            })]
          );
          params.successCallback(rows, totalCount);
        } catch (error) {
          console.error(error);
        }
      },
    };
    return datasource;
  };

  const handleUpdateIconClick = (params) => {
    const {data: rowData} = params

    const {id, ...rest} = rowData

    dispatch(newRowState({modelId, rowId: rowData.id, rowState: rest}))
  };

  const handleRowClicked = (event: RowClickedEvent) => {

    console.log({event})
    
  }; 


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

  const handleColumnSelect = (selectedColumns: Array<string | undefined>) => {
    setSelectedColumns(selectedColumns);
    setShowColumnSelector(false);
  };

  useEffect(()=>{
    console.log({deleteMode})
    if(deleteMode) {
      columnApi?.setColumnVisible('delete-mode', true)
    } else {
      columnApi?.setColumnVisible('delete-mode', false)
      selectedRows.forEach(row=>{
        row.setSelected(false)
      })
    }
  },[deleteMode])

  useEffect(()=>{
    console.log({updateMode})
    if(updateMode) {
      columnApi?.setColumnVisible('update-mode', true)
    } else {
      columnApi?.setColumnVisible('update-mode', false)
    }
  },[updateMode])

  useEffect(() => {
    if (columnApi && columnDefs) {
      columnDefs.forEach((columnDef) => {
        if(!columnDef.field) return

        if (selectedColumns.includes(columnDef.field)) {
          columnApi.setColumnVisible(columnDef.field, true);
        } else {
          columnApi.setColumnVisible(columnDef.field, false);
        }
      });
    }
  }, [columnApi, selectedColumns]);

  function onFirstDataRendered(params: AgGrigFirstDataRenderedEvent) {}

  const gridOptions: GridOptions = {
    rowModelType: "infinite",
    cacheBlockSize: 100,
    suppressRowClickSelection: true,
    onCellClicked: (e) => {
      console.log(e.column.getColId())
        // if (e.column.getColId() !== 'delete-mode') { 
        //     e.node.setSelected(true);
        // }
    }
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const datasource = useMemo<IDatasource>(() => {
    return getDataSource();
  }, [modelId]);

  function restoreGridColumnStates() {
    if (columnApi && lastState) {
      columnApi.applyColumnState({ state: lastState });
    }
  }

  useEffect(()=>{
    restoreGridColumnStates()
  },[columnDefs])

  const onSelectionChanged = (event: SelectionChangedEvent): void => {
    const selectedRows = event.api.getSelectedNodes();
    setEntriesToBeDeleted(selectedRows.map(row=> row.data.id))
    setSelectedRows(selectedRows)
  };



  return (
    <>
      <div style={gridStyle} className="ag-theme-alpine">
        {columnDefs && <PVAggridColumnSelector columnState={columnState} setShowColumnSelector={setShowColumnSelector} showColumnSelector={showColumnSelector} onColumnSelect={handleColumnSelect} columns={columnDefs} />}
        <AgGridReact
          gridOptions={gridOptions}
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
          datasource={datasource}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          // getRowId={getRowId}
        ></AgGridReact>
      </div>
    </>
  );
};

export default PVGridWebiny2;
