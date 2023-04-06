import { Children, SetStateAction, useEffect, useMemo, useState } from "react";
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
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { current } from "immer";
import Spinner from "react-bootstrap/Spinner";
import { Button } from "semantic-ui-react";
import { GetModelFieldsReturn } from "../views/ModelView";
import { ModelContentListData } from "../types";

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

  const { model } = useSelector((state: any) => state.model);
  const getDataSource = () => {
    const datasource: IDatasource = {
      getRows: async (params: IGetRowsParams) => {
        try {
          const pageSize = params.endRow - params.startRow;

          const index = Math.floor(params.startRow / pageSize);
          const data = (await getModelFields(
            model.modelId,
            params.endRow - params.startRow,
            [...cursors][index]
          )) as GetModelFieldsReturn;

          console.log({ cursors });

          setCursors((previousState) => previousState.add(data.meta.cursor));

          const { totalCount } = data.meta;
          console.log(params.startRow, params.endRow);

          const rowData = data.modelContentListData.map((row) => {
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
              };
            })
          );
          params.successCallback(rowData, totalCount);
        } catch (error) {
          console.error(error);
        }
      },
    };
    return datasource;
  };

  const gridOptions: GridOptions = {
    rowModelType: "infinite",
    onPaginationChanged: (e: PaginationChangedEvent) => {
      console.log(
        `Pagination Event: ${JSON.stringify(e.api.getLastDisplayedRow())}`
      );
    },
    cacheBlockSize: 100,
  };

  const datasource = useMemo<IDatasource>(() => {
    return getDataSource();
  }, [model]);

  return (
    <PVGridWebinyStyles>
      <div className="ag-theme-alpine">
        {/* {!isLoaded && <div className="lds-dual-ring"></div>} */}
        <AgGridReact
          paginationAutoPageSize={true}
          pagination={true}
          gridOptions={gridOptions}
          datasource={datasource}
          maxConcurrentDatasourceRequests={1}
          columnDefs={columnDefs}
        ></AgGridReact>
        {/* {!isLoaded && <div className="white"></div>} */}
      </div>
      {/* {!modelChanged && <div className="pagination-panel"> */}
      {/*   <button onClick={()=> changePage('DECREASE') } ><i className="fa-solid fa-angle-left"></i></button> */}
      {/*   <label className="rows-count">{currentPage} de {totalPages}</label> */}
      {/*   <button onClick={()=> changePage('INCREASE')}><i className="fa-solid fa-angle-right"></i></button> */}
      {/* </div>} */}
    </PVGridWebinyStyles>
  );
};

const PVGridWebinyStyles = styled.div`
  .ag-theme-alpine {
    max-width: 90%;
    height: 477px;
    margin-inline: auto;
    position: relative;
    .white {
      width: 100%;
      height: 100%;
      background-color: white;
      position: absolute;
      z-index: 1;
      top: 0;
    }
  }
  .lds-dual-ring {
    display: inline-block;
    width: 80px;
    height: 80px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    position: absolute;
    z-index: 2;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid blue;
    border-color: blue transparent blue transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default PVGridWebiny2;
