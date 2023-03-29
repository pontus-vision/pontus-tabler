import { useEffect } from "react"

const EntriesList = ({data}) => { 
  
  useEffect(()=>{
    console.log(data)
  },[data])

  return (
     
  )
}

export default EntriesList
