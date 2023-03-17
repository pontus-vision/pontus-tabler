import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import "tabler-react/dist/Tabler.css";
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import ModelView from './views/ModelView';

function App() {
  const [count, setCount] = useState(0)
  const [openedSidebar, setOpenedSidebar] = useState(false)
  const [modelId, setModelId] = useState<string>()
  return (
    <>
     <Header setOpenedSidebar={setOpenedSidebar} openedSidebar={openedSidebar} /> 
      <Sidebar openedSidebar={openedSidebar} /> 
      <Routes>
        <Route path="/model" element={<ModelView modelId={modelId} />}/>
      </Routes>
    </>
  )
}

export default App
