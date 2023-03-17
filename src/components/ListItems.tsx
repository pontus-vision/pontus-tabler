import ListGroup from "react-bootstrap/ListGroup";
import { useEffect, useState } from "react";
import styled from 'styled-components'
import { getContentModel, listModel } from "../client";

const ListItems = ({header, arr }:ListItemsProp) => { 
  const [showList, setShowList] = useState(false)
  useEffect(()=>{
    console.log({showList})
  },[showList])

  const toggleList = () => {
    console.log("clicked")
    setShowList(!showList)
  }

  const getModelFields = async(modelId: string) => {
    console.log(modelId[modelId.length -1] !== "s" ? modelId + "s" : modelId )
    const modelIdFormatted = modelId[modelId.length -1] !== "s" ? modelId + "s" : modelId

    const data = await getContentModel(modelId)
    console.log(await listModel(modelId, data))
  }

  return (
    <ListItemsStyles>
      <label onClick={toggleList} className={`${showList ? 'active' : ""}`}>{header}</label> 
   <ListGroup  className={`group ${showList ? 'active' : ''}`}>
      {!!arr && arr.map(item=><ListGroup.Item onClick={()=>getModelFields(item.modelId)} className={`group__item ${showList ? 'active' : ""}`}>{item.name}</ListGroup.Item>)}
    </ListGroup>
    </ListItemsStyles>
  )

}

const ListItemsStyles = styled.div`
  /* & .active { */
  /*   background-color: blue; */
  /*   color: white; */
  /* } */
  & .group {    
    /* transform: translateX(-100%);  */
    position: relative;
    /* position: absolute */
    /* display: none; */
    overflow: hidden;
    left: -30rem; 
    height: 0;
    transition:height 200ms ease-in-out, left 200ms ease-in-out, transform 200ms ease-in-out;
    &.active{
      /* height: fit-content; */
      height: 100%;
      position: relative;
      left: 0rem;
      display: block;
      /* transform: translateX(0%); */
    }
    &__item{
      /* position: absolute; */
      &:hover{
        background-color: blue;
        color: white;
      }
   
      
    
    }
  }
`

type ListItemsProp = {
  header?: string
  arr: any[]
}

export default ListItems
