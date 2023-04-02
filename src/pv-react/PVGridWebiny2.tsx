import { Children, SetStateAction, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";
import { ColDef, ColumnApi, GridApi, IGroupCellRendererParams, IServerSideDatasource, SideBarDef } from "ag-grid-community";
import { useSelector } from "react-redux";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { current } from "immer";

type Props = {
  headers: any[]
  rows: any[]
}

const PVGridWebiny2 = ({headers, rows, getModelFields}:Props) => {
  const [rowData, setRowData] = useState<SetStateAction<any>>([]);
  const [columnDefs, setColumnDefs] = useState<SetStateAction<any>>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [modelChanged, setModelChanged] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [perPage, setPerPage] = useState<number>(2)
  const [pages, setPages] = useState<Set<string> | Set<null>>(new Set([null]))
  const {model} = useSelector(state=> state.model) 
  const totalPages = Math.ceil(totalCount / perPage)
  
  useEffect(() => {
    console.log([...pages][currentPage - 1])
    setIsLoaded(false)
    const data = getModelFields(model.modelId, perPage, [...pages][currentPage - 1]).then(res=>{
      const {queryList} = res
      if(!!queryList?.meta?.cursor){
        setPages(previousState=> new Set([...previousState, queryList?.meta?.cursor]))
      }
      setTotalCount(queryList.meta.totalCount)
      setIsLoaded(true)
    })
  }, [model, currentPage]);

  useEffect(()=>{
    setCurrentPage(1)
    setModelChanged(true)
  },[model])
  
  useEffect(()=> {
    isLoaded && setModelChanged(false)
  },[isLoaded])

  const setRows = () => {
    if (!rows.data) return  
    const rowsFormatted = rows.data.map(row=> {
      // const {createdBy, createdOn, entryId, id, ownedBy, savedOn, ...rest} = row
      const rowEntries = Object.entries(row)
      
      return rowEntries.map(entry=> {
        const [key, value] = entry
        const label = headers.find(header =>header.fieldId === key)?.label
        const obj= {} as any
        if(label === undefined) return
       obj[label] = typeof value === "string" ? value : "" || 
        Array.isArray(value) && value.every(el=> typeof el === "string") ? value.join(", ") : "" 
            // || Array.isArray(value) && value.every(el=> typeof value === "object" && Array.isArray(el)) ? 
       
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
    const columnsFormatted = headers.map(header=> {
      const obj = {
        field: header.label
      }
      const refModel = header?.settings?.models?.map(el=>{return{field: Object.values(el)[0]}})
      console.log(header, !!refModel)
      if (!refModel) return obj
      if(refModel?.length > 0){
         
        const objWithChildren = {
          ...obj,
          children: refModel
        } 
        return objWithChildren 
      } 
    })
    console.log(columnsFormatted)
    setColumnDefs(columnsFormatted)
  }
  useEffect(()=>{
    console.log(rowData)
  },[rowData])

  const changePage = (action: string) => {
    if(action === 'DECREASE') {
      console.log({totalCount, perPage, currentPage, action})
      currentPage > 1 && setCurrentPage(currentPage - 1) 
    }
    if(action === 'INCREASE') {
      
      console.log({totalPages, totalCount, perPage, action})
      currentPage < totalPages && setCurrentPage(currentPage + 1)
    }
  }

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 200,
      resizable: true,
      // floatingFilter: true,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    };
  }, []);

  useEffect(()=>{
    setRows()
    setColumns()
  },[rows, headers])

  return (
    <PVGridWebinyStyles>
      <div className="ag-theme-alpine">
        <AgGridReact  
          groupSelectsChildren={true} 
          rowGroupPanelShow={'always'} 
          rowSelection={'multiple'}
          rowData={rowData}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}></AgGridReact>
      </div>
      {!modelChanged && <div className="pagination-panel">
        <button onClick={()=> changePage('DECREASE') } ><i className="fa-solid fa-angle-left"></i></button>
        <label className="rows-count">{currentPage} de {totalPages}</label>
        <button onClick={()=> changePage('INCREASE')}><i className="fa-solid fa-angle-right"></i></button>
      </div>}
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
