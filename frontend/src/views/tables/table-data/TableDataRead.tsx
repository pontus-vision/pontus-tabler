import { useParams } from "react-router-dom"
import PVGridWebiny2 from "../../../pv-react/PVGridWebiny2"
import { useEffect, useState } from "react"
import { tableRead } from "../../../client"
import { TableColumnRef } from "../../../pontus-api/typescript-fetch-client-generated"

const TableDataRead = () => {
    const [cols, setCols] = useState<TableColumnRef[]>()
    const tableId = useParams().id

    useEffect(()=>{
        if(!tableId) return

        const fetchTableData = async(tableId: string) => {
            try {
                const res = await tableRead({id: tableId})
                const colsRes = res?.data.cols?.map(col=>{return {...col, editable: true}})

                setCols(colsRes)
            } catch (error) {
                
            }
        }

        fetchTableData(tableId)
    },[tableId])
    

    return(
        <>
        {cols && <PVGridWebiny2 cols={cols}/>}    
        </>
    )
}

export default TableDataRead