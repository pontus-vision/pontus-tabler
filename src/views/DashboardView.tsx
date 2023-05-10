import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import PVFlexLayout from "../pv-react/PVFlexLayout";
import { RootState } from "../store/store";
import { Dashboard } from "../types";

type Props = {
  dashboardId?: string;
};

const DashboardView = ({ dashboardId }: Props) => {
  const { value: dashboards } = useSelector(
    (state: RootState) => state.dashboards
  );
  const [dashboard, setDashboard] = useState<Dashboard>();

  useEffect(() => {
    setDashboard(dashboards.find((el) => el.id === dashboardId));
  }, [dashboardId]);

  useEffect(() => {
    console.log({ dashboard });
  }, [dashboard]);

  return (
    <DashboardViewStyles>
      <h1>{dashboard?.name}</h1>
      <div className="layout">
        <PVFlexLayout gridState={dashboard?.gridState} />
      </div>
    </DashboardViewStyles>
  );
};

const DashboardViewStyles = styled.div`
  & .layout {
    height: 30rem;
    position: relative;
    width: 90%;
  }
`;

export default DashboardView;
