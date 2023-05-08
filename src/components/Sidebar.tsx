import { useState, useEffect, Dispatch } from "react";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getModels } from "../client";
import { RootState } from "../store/store";
import ListItems from "./ListItems";

type Props = {
  openedSidebar: boolean;
  setDashboardId: Dispatch<React.SetStateAction<string | undefined>>;
};

const Sidebar = ({ openedSidebar, setDashboardId }: Props) => {
  const [models, setModels] = useState() as any[];
  const [showForms, setShowForms] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { value: dashboards } = useSelector((state: RootState) => {
    return state.dashboards;
  });

  useEffect(() => {
    console.log({ dashboards });
  }, [dashboards]);

  return (
    <SidebarStyles className={`${openedSidebar ? "active" : ""}`}>
      <Button onClick={() => navigate("/admin")}>Admin Panel</Button>
      {dashboards &&
        dashboards.map((dashboard) => (
          <label
            onClick={() => {
              navigate("/dashboard");
              setDashboardId(dashboard.id);
            }}
            key={dashboard.id}
          >
            {dashboard.name}
          </label>
        ))}
    </SidebarStyles>
  );
};

const SidebarStyles = styled.div`
  width: 14rem;
  position: absolute;
  padding: 0.3rem 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #ffffffeb;
  overflow-y: auto;
  height: calc(100% - 3rem);
  translate: -100%;
  transition: translate 100ms ease-in-out;
  z-index: 2;

  &::before {
    content: "";
    background-color: white;
  }

  &.active {
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
`;

export default Sidebar;
