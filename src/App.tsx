import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import "tabler-react/dist/Tabler.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import AdminView from "./views/AdminView";
import Form from "./components/Form";
import DashboardView from "./views/DashboardView";
import NewEntryView from "./views/NewEntry";

function App() {
  const [count, setCount] = useState(0);
  const [openedSidebar, setOpenedSidebar] = useState(false);
  const [dashboardId, setDashboardId] = useState<string>();
  return (
    <>
      <Header
        setOpenedSidebar={setOpenedSidebar}
        openedSidebar={openedSidebar}
      />
      <Sidebar setDashboardId={setDashboardId} openedSidebar={openedSidebar} />
      <Routes>
        <Route path="/admin" element={<AdminView />} />
        <Route
          path="/dashboard"
          element={<DashboardView dashboardId={dashboardId} />}
        />
        {/* <Route path="/NewEntry/:modelId" element={<NewEntryView />}/> */}
      </Routes>
    </>
  );
}

export default App;
