import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import {
  Meta,
  Dashboard,
  FlexLayoutCmp,
  IListModelResponseData,
} from "../types";
import { IJsonModel } from "flexlayout-react";
import PVFlexLayout from "../pv-react/PVFlexLayout";
import { setDashboards } from "../store/sliceDashboards";
import FormDashboard from "../components/FormDashboard";
import CmpPanel from "../components/CmpPanel";
import { useTranslation } from "react-i18next";
import NewEntryView from "./NewEntryView";
import { ICmsGetContentModelDataField } from "../types";

export type GetModelFieldsReturn = {
  columnNames: ICmsGetContentModelDataField[];
  modelContentListData: IListModelResponseData[];
  meta: Meta;
};

const AdminView = () => {
  const [gridState, setGridState] = useState<IJsonModel>();
  const [showDashboardForm, setShowDashboardForm] = useState(false);
  const [selectedCmp, setSelectedCmp] = useState<FlexLayoutCmp>();
  const { t, i18n } = useTranslation();
  

  const dispatch = useDispatch();

  const saveDashboard = (name: string) => {
    if (!gridState) return;
    const id = "id" + Math.random().toString(16).slice(2);
    const dashboard: Dashboard = {
      name,
      id,
      gridState,
    };
    console.log(dashboard);
    dispatch(setDashboards(dashboard));
  };

  return (
  
      <AdminViewStyles>
        <CmpPanel setSelectedCmp={setSelectedCmp} />
        <PVFlexLayout setGridState={setGridState} selectedCmp={selectedCmp} />
        
        {showDashboardForm && (
          <FormDashboard
            saveDashboard={saveDashboard}
            setShowDashboardForm={setShowDashboardForm}
          />
        )}
        <button onClick={() => setShowDashboardForm(true)}>{t("save-state")}</button>
      </AdminViewStyles>
   
  );
};

const AdminViewStyles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
  gap: 1rem;
  height: 92%;
  width: 100%;

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: #0000004b
  }

  .layout {
    position: relative;
    top: 0rem;
    height: 30rem;
    width: 90%;
  }
`;

export default AdminView;
