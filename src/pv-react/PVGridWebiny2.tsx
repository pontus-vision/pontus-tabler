  import { Dispatch, useEffect, useMemo, useState } from "react";
  import { AgGridReact } from "ag-grid-react";
  import "ag-grid-community/styles/ag-grid.css";
  import "ag-grid-community/styles/ag-theme-alpine.css";
  import {
    CellClickedEvent,
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
  import { AgGrigFirstDataRenderedEvent, ICmsGetContentModelDataField, IListModelResponse } from "../types";
  import { cmsGetContentModel, listModel } from "../client";
  import { useDispatch, useSelector } from "react-redux";
  import NewEntryView from "../views/NewEntryView";
  import PVAggridColumnSelector from "../components/PVAggridColumnSelector";
  import { newRowState } from "../store/sliceGridUpdate";
  import { _isClickEvent } from "chart.js/dist/helpers/helpers.core";
import { IListModelResponseData } from "../types";
import { UnknownKey } from "../types";

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
    setEntriesToBeDeleted: Dispatch<React.SetStateAction<string[] | undefined>>
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
    const [checkHiddenObjects, setCheckHiddenObjects] = useState(false); 
    const gridStyle = useMemo(() => ({ height: "27rem", width: "100%" }), []);
    const dispatch = useDispatch()
    const [selectedColumns, setSelectedColumns] = useState<Array<string | undefined>>([]);
    


    const getModelFields = async (
      modelId: string,
      limit: number,
      after: string | null,
      fieldsSearches = null,
      sorting?: string
    ) => {
      const cmsContentModel = await cmsGetContentModel(modelId);

      const { fields: columnNames } = cmsContentModel.data;
      const data = await listModel(
        modelId,
        columnNames,
        limit,
        after,
        fieldsSearches,
        sorting
      );

      if (!data) return

      const { data: modelContentListData, meta } = data

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

            let sorting;
            console.log(params.sortModel)
            if(params.sortModel.length > 0)
            { 
              const colId = params?.sortModel[0].colId
              const sort = params?.sortModel[0].sort
              sorting = `${colId}_${sort.toUpperCase()}`
            }
            console.log({sorting})
            

            if (!modelId) return;
            
            
            const data = await getModelFields(
              modelId,
              pageSize,
              [...cursors][index],
              filter,
              sorting
            );

            if(!data) return

            setCursors((previousState) => previousState.add(data.meta.cursor));

            const { totalCount } = data.meta;

          
            const rows = data.modelContentListData.map((row: IListModelResponseData) : {[key: string]: unknown} => {
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

            const objFields = data.columnNames.filter(col=> col.type === "object")

            
            
            const refInputFields = data.columnNames.filter(col=> col.renderer.name === "ref-input")

            const refInputsFields = data.columnNames.filter(col=> col.renderer.name === "ref-inputs")


            const rows2 = rows.map(row=>{   

              const flattenObj = (ob: {[key: string]: any}) => {
                let result = {} as any
                for (const i in ob) {
                    if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i]) && objFields.some(field=> field.fieldId === i)) {
                      
                        const temp = flattenObj(ob[i]);
                        for (const j in temp) {
            
                            // Store temp in result
                            result[j] = temp[j];
                        }
                    }else if(refInputFields.some(field=> field.fieldId === i)){
                      if(!!ob[i]){
                        result[i] = Object.values(ob[i])[0]
                      } 
                      
                    }else if (refInputsFields.some(field=> field.fieldId === i)) {
                      if(ob[i]) {
                        const values =  ob[i].map((el: {[key: string]: unknown})=> Object.values(el)[0])
                        result[i] = values.length > 1 ? values.join(", ") : values
                      } 
                    }
                    else {
                        result[i] = ob[i];
                    }
                }
                return result;
              };

              return flattenObj(row)
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
                if(field.type === "object" && field.settings?.fields && checkHiddenObjects === false) {
                  return {
                    headerName: field.label,
                    field: field.fieldId,
                    children: field.settings?.fields.map(field=>{ return{ sortable: false, field: field.fieldId, headerName: field.label}})
                  }
                }else if(field.type === "ref"){
                  return {
                    headerName: field.label,
                    field: field.fieldId,
                    sortable: false
                  }
                }
                return {
                  headerName: field.label,
                  field: field.fieldId,
                  filter: "agTextColumnFilter",
                  filterParams: { apply: true, newRowsAction: "keep" },
                };
              })
            ]);
            params.successCallback(rows2, totalCount);
          } catch (error) {
            console.error(error);
          }
        },
      };
      return datasource;
    };


    

    useEffect(()=>{
      const objects = columnDefs?.filter((el: {[key: string]: any})=> el?.children)
      
      console.log({columnState, columnDefs, objects})
      const checkHiddenObj = objects && objects.length > 0 && objects.map((obj: {[key: string]: any})=> obj.children.every((child: {[key: string]: unknown})=> columnState?.some(col=> child.field === col.colId && col.hide))).every(el => el === true)
      
      checkHiddenObj && setCheckHiddenObjects(true)

      console.log({checkHiddenObj})
      if(checkHiddenObj) {
        console.log({checkHiddenObj, checkHiddenObjects})
        
        setColumnDefs(prevState=> prevState = prevState?.filter(col=> !objects.some(obj=> obj === col)))
      }
      
    },[columnState])

    useEffect(()=>{
      console.log({checkHiddenObjects})
    },[checkHiddenObjects])

    const handleUpdateIconClick = (params: CellClickedEvent<any, any>) => {
      const {data: rowData} = params

      const {id, ...rest} = rowData

      dispatch(newRowState({modelId, rowId: rowData.id, rowState: rest}))
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
        sortable: true,
        resizable: true
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
            
          ></AgGridReact>
        </div>
      </>
    );
  };

  export default PVGridWebiny2;
