import { SetStateAction, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";

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
      return rowEntries.map(entry=> {
        const [key, value] = entry
        const label = headers.find(header =>header.fieldId === key)?.label
        console.log(label, key)
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


  return (
    <PVGridWebinyStyles>
      <div className="ag-theme-alpine">
        <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
      </div>
    </PVGridWebinyStyles>
  );
};

const PVGridWebinyStyles = styled.div`
  .ag-theme-alpine{
    width: 90%;
    height: 400px;
    margin-inline: auto;
  }
`

export default PVGridWebiny2;
