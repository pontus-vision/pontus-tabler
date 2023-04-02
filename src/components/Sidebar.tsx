import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from 'styled-components'
import { getModels } from "../client";
import ListItems from "./ListItems";

const Sidebar = ({openedSidebar}:any) => {
  const [models, setModels] = useState() as any[];
  const [showForms, setShowForms] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const dispatch = useDispatch()

  const fetchModels = async () => {
    const { data } = await getModels();
    const listModels = data.data.listContentModels.data
    const listModelsGrouped = listModels.reduce((acc, cur) => {
        const key = cur.group.name
          
        acc[key] = (acc[key] || [])
          acc[key].push(cur);

        return acc;
    }, {})

    const listModelsGroupedArr = Object.entries(listModelsGrouped)
    
    setModels(listModelsGroupedArr);
    return data;
  };

  useEffect(() => {
    // setModels(await fetchModels())
    fetchModels();
  }, []);
  
  useEffect(()=>{
    console.log(openedSidebar)
  },[openedSidebar])

  useEffect(()=>{
    // dispatch(setModels(models))
  },[models])

  return (
    <SidebarStyles className={`${openedSidebar ? "active" : ""}`}>
      {!!models && models.map((entry: any) => <ListItems header={entry[0]} arr={entry[1]} />)}
    </SidebarStyles>
  );
};

const SidebarStyles = styled.div`
  width: 14rem;
  position: absolute; 
  padding: .3rem .4rem;
  display: flex;
  flex-direction: column; 
  gap: 1rem;
  background-color: #ffffffeb;
  overflow-y: auto; 
  height: calc(100% - 3rem);
  translate: -100%;
  transition: translate 100ms ease-in-out;
  z-index:2;
  
  &::before{
    content: "";
    background-color: white;
  } 

  &.active{
    translate: 0; 
  }
/* width */
::-webkit-scrollbar {
  width: 4px;
    position: absolute;
}

/* Track */
::-webkit-scrollbar-track {
    position: absolute;
    background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
    position: absolute;
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
`

export default Sidebar;
