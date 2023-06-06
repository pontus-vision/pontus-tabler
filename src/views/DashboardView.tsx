import { IJsonModel } from "flexlayout-react";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CmpPanel from "../components/CmpPanel";
import PVFlexLayout from "../pv-react/PVFlexLayout";
import { deleteDashboard, updateDashboard } from "../store/sliceDashboards";
import { RootState } from "../store/store";
import { Dashboard, FlexLayoutCmp } from "../types";
import { useTranslation } from "react-i18next";
import NewEntryView from "./NewEntryView";

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
  const [deleteModal, setDeleteModal] = useState(false);
  const [modelId, setModelId] = useState<string | undefined>()

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    setDashboard(dashboards.find((el) => el.id === dashboardId));
  }, [dashboardId]);

  useEffect(() => {
    console.log({ dashboard });
  }, [dashboard]);

  useEffect(() => {console.log(modelId)}, [modelId]);

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

  const delDashboard = () => {
    console.log({ dashboardId });
    dispatch(deleteDashboard({ id: dashboardId }));
    navigate("/");
  };

  return (
    <DashboardViewStyles>
      <h1 className="title">{dashboard?.name}</h1>
      <div className="actions-panel">
        {addCmp && <CmpPanel setSelectedCmp={setSelectedCmp} />}
        {!addCmp && (
          <i onClick={() => setAddCmp(true)} className="fa-light fa-plus"></i>
        )}
        <Button onClick={() => setDeleteModal(true)}>{t("delete-dashboard")}</Button>
        {deleteModal && (
          <div className="delete-dashboard-modal">
            <label>{dashboard?.name}</label>
            <label>{t("confirm-delete")}</label>
            <div className="delete-dashboard-modal__options">
              <button onClick={() => delDashboard()}>{t("yes")}</button>
              <Button onClick={() => setDeleteModal(false)}>{t("no")}</Button>
            </div>
          </div>
        )}
        {isEditing && (
          <Button className="actions-panel__save" onClick={() => saveEdition()}>
            {t("save-state")}
          </Button>
        )}
      </div>
      <PVFlexLayout
        setModelId={setModelId}
        selectedCmp={selectedCmp}
        setGridState={setGridState}
        gridState={dashboard?.gridState}
        setIsEditing={setIsEditing}
      />
      <div className="shadow"></div>
      
        {modelId && <NewEntryView setModelId={setModelId} modelId={modelId} />}
    </DashboardViewStyles>
  );
};

const DashboardViewStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 92%;


  & .title {
    margin: 0;
  }
  & .layout {
    min-height: 30rem;
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
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
  }

  & .actions-panel {
    display: flex;
    width: 90%;
    justify-content: space-around;
    &__save {
      background-color: #8d8b01;
    }
  }
  & .delete-dashboard-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    height: 30%;
    width: 30%;
    background-color: blue;
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    transform: translate(-50%, -50%);
    & label {
      font-size: 1.5rem;
    }
  }
  & .flex-layout-wrapper {
    height: 30rem;
    width: fit-content;
    overflow-y: auto;
  }
`;

export default DashboardView;
