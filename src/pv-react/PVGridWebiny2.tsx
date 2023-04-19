import { Children, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  IDatasource,
  IGetRowsParams,
  IGroupCellRendererParams,
  IServerSideDatasource,
  PaginationChangedEvent,
  SideBarDef,
} from "ag-grid-community";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GetModelFieldsReturn } from "../views/ModelView";
import {
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

type Props = {
  headers: any[];
  rows: ModelContentListData[];
  getModelFields: any;
};

const PVGridWebiny2 = ({ headers, rows, getModelFields }: Props) => {
  const [columnDefs, setColumnDefs] = useState<SetStateAction<any>>([]);
  const [cursors, setCursors] = useState(new Set([null]));
  const [indexPage, setIndexPage] = useState<number>(0);
  const [gridApi, setGridApi] = useState(null);
  const [showGrid, setShowGrid] = useState(true)
  const { modelId } = useParams();
  const gridStyle = useMemo(() => ({ height: "30rem", width: "100%" }), []);
  const { model } = useSelector((state: any) => state.model);
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef()

  useEffect(() => {}, [modelId]);

  const getDataSource = () => {
    const datasource: IDatasource = {
      getRows: async (params: IGetRowsParams) => {
        if(!showGrid) return

        try {
          const pageSize = params.endRow - params.startRow;

          const index = Math.floor(params.startRow / pageSize);

          const filter = params.filterModel;

          console.log(filter);

          if (Object.values(filter)[0]) {
            const fieldId = Object.keys(filter)[0];

            console.log({ filter });
            const filterInput = filter[fieldId].filter;

            console.log({ modelId, pageSize, cursors, filterInput, fieldId });

            const data = (await getModelFields(
              modelId,
              pageSize,
              [...cursors][index],
              filter
            )) as GetModelFieldsReturn;
            console.log(data);

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
            // console.log({data}, modelId, fieldId, filterModel[fieldId].filter)
            return;
          }

          const data = (await getModelFields(
            modelId,
            pageSize,
            [...cursors][index]
          )) as GetModelFieldsReturn;

          const { startRow, endRow } = params;

          console.log({ cursors, startRow, endRow, index, pageSize });

          setCursors((previousState) => previousState.add(data.meta.cursor));

          const { totalCount } = data.meta;
          console.log(params.startRow, params.endRow);

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

          console.log({ rowData, rows });

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
          console.log({ rowData });
          params.successCallback(rows, totalCount);
        } catch (error) {
          console.error(error);
        }
      },
    };
    return datasource;
  };

  function onFirstDataRendered(params) {
    gridRef.current = params.api;
  }

  function resetFilters() {
    if (gridRef.current) {
      gridRef?.current?.api?.setFilterModel(null);
      console.log({gridRef})
    }
  }

  useEffect(() => {
    setShowGrid(false)
    setTimeout(()=>{
      setShowGrid(true) 
    },10)
  }, [modelId]);

  const gridOptions: GridOptions = {
    rowModelType: "infinite",
    onPaginationChanged: (e: PaginationChangedEvent) => {
      console.log(
        `Pagination Event: ${JSON.stringify(e.api.getLastDisplayedRow())}`
      );
    },
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

  return (
    <PVGridWebinyStyles>
      {showGrid && <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          enableRangeSelection={true}
          paginationAutoPageSize={true}
          defaultColDef={defaultColDef}
          ref={gridRef}
          onFirstDataRendered={onFirstDataRendered}
          pagination={true}
          gridOptions={gridOptions}
          datasource={datasource}
          // maxConcurrentDatasourceRequests={1}
          columnDefs={columnDefs}
        ></AgGridReact>
      </div>}
    </PVGridWebinyStyles>
  );
};

const PVGridWebinyStyles = styled.div``;

export default PVGridWebiny2;
