import { SetStateAction, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";
import { ColDef, IGroupCellRendererParams } from "ag-grid-community";

type Props = {
  headers: any[]
  rows: any[]
}

const PVGridWebiny2 = ({headers, rows}:Props) => {
  const [rowData, setRowData] = useState<SetStateAction<any>>([]);
  const [columnDefs, setColumnDefs] = useState<SetStateAction<any>>([]);

  const setRows = () => {
    if (!rows) return  
    const rowsFormatted = rows.map(row=> {
      // const {createdBy, createdOn, entryId, id, ownedBy, savedOn, ...rest} = row
      const rowEntries = Object.entries(row)
      console.log(row)
      return rowEntries.map(entry=> {
        const [key, value] = entry
        const label = headers.find(header =>header.fieldId === key)?.label
        const obj= {} as any
        if(label === undefined) return
        obj[label] = typeof value === "string" ? value : ""
        return obj
      })
    }).map(el=> el.filter(el2=>!!el2)).map(row=>row.reduce((result, current) => {
      const key = Object.keys(current)[0];
      result[key] = current[key];
      return result;
    }, {}))

    setRowData(rowsFormatted)
  } 

  const setColumns = () => {
    if(!headers) return
    const columnsFormatted = headers.map(header=> {return {field: header.label}})
    setColumnDefs(columnsFormatted)
  }
  useEffect(()=>{

    console.log(rowData)
  },[rowData])



  useEffect(()=>{
    setRows()
    setColumns()
  },[rows, headers])

const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
      // allow every column to be aggregated
      enableValue: true,
      // allow every column to be grouped
      enableRowGroup: true,
      // allow every column to be pivoted
      enablePivot: true,
      sortable: true,
      filter: true,    };
  }, []);
const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: 'Group',
      minWidth: 170,
      field: 'athlete',
      valueGetter: (params) => {
        if (params.node!.group) {
          return params.node!.key;
        } else {
          return params.data[params.colDef.field!];
        }
      },
      headerCheckboxSelection: true,
      // headerCheckboxSelectionFilteredOnly: true,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        checkbox: true,
      } as IGroupCellRendererParams,
    };
  }, []);

  return (
    <PVGridWebinyStyles>
      <div className="ag-theme-alpine">
        <AgGridReact pagination={true} 
          paginationAutoPageSize={true} 
          pivotPanelShow={'always'} 
          groupSelectsChildren={true} 
          rowGroupPanelShow={'always'} 
          rowSelection={'multiple'} 
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowData={rowData} 
          columnDefs={columnDefs}></AgGridReact>
      </div>
    </PVGridWebinyStyles>
  );
};

const PVGridWebinyStyles = styled.div`
  .ag-theme-alpine{
    max-width: 90%;
    height: 477px;
    margin-inline: auto;
  }
`

export default PVGridWebiny2;
