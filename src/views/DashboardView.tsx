import { IJsonModel } from "flexlayout-react";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import CmpPanel from "../components/CmpPanel";
import PVFlexLayout from "../pv-react/PVFlexLayout";
import { updateDashboard } from "../store/sliceDashboards";
import { RootState } from "../store/store";
import { Dashboard, FlexLayoutCmp } from "../types";

type Props = {
  dashboardId: string;
};

const DashboardView = ({ dashboardId }: Props) => {
  const { value: dashboards } = useSelector(
    (state: RootState) => state.dashboards
  );
  const [isEditing, setIsEditing] = useState(false);
  const [addCmp, setAddCmp] = useState(false);
  const [dashboard, setDashboard] = useState<Dashboard>();
  const [gridState, setGridState] = useState<IJsonModel>();
  const [selectedCmp, setSelectedCmp] = useState<FlexLayoutCmp>();
  const dispatch = useDispatch();

  useEffect(() => {
    setDashboard(dashboards.find((el) => el.id === dashboardId));
  }, [dashboardId]);

  useEffect(() => {
    console.log({ dashboard });
  }, [dashboard]);

  useEffect(() => {}, [gridState]);

  useEffect(() => {
    console.log({ isEditing });
  }, [isEditing]);
  const saveEdition = () => {
    if (gridState) {
      setIsEditing(false);
      setAddCmp(false);
      dispatch(updateDashboard({ id: dashboardId, item: gridState }));
    }
  };

  return (
    <DashboardViewStyles>
      <h1 className="title">{dashboard?.name}</h1>
      {addCmp && <CmpPanel setSelectedCmp={setSelectedCmp} />}
      {!addCmp && (
        <i onClick={() => setAddCmp(true)} className="fa-light fa-plus"></i>
      )}
      <div className="layout">
        <PVFlexLayout
          selectedCmp={selectedCmp}
          setGridState={setGridState}
          gridState={dashboard?.gridState}
          setIsEditing={setIsEditing}
        />
      </div>
      <div className="shadow"></div>
      {isEditing && (
        <Button onClick={() => saveEdition()}>Salvar Edição</Button>
      )}
    </DashboardViewStyles>
  );
};

const DashboardViewStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  & .title {
    margin: 0;
  }
  & .layout {
    height: 30rem;
    position: relative;
    width: 90%;
  }
  & .shadow {
    height: 100%;
    width: 100%;
  }

  & .fa-plus {
    font-size: 3rem;
    border: 1px solid black;
  }
`;

export default DashboardView;
