import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import {
  ModelColName,
  ModelContentListData,
  Meta,
  Dashboard,
  FlexLayoutCmp,
} from "../types";
import { IJsonModel } from "flexlayout-react";
import PVFlexLayout from "../pv-react/PVFlexLayout";
import { setDashboards } from "../store/sliceDashboards";
import FormDashboard from "../components/FormDashboard";
import CmpPanel from "../components/CmpPanel";

export type GetModelFieldsReturn = {
  columnNames: ModelColName[];
  modelContentListData: ModelContentListData[];
  meta: Meta;
};

const AdminView = () => {
  const [gridState, setGridState] = useState<IJsonModel>();
  const [showDashboardForm, setShowDashboardForm] = useState(false);
  const [selectedCmp, setSelectedCmp] = useState<FlexLayoutCmp>();

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log({ gridState });
  }, [gridState]);

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
    <>
      <ModelViewStyles>
        <CmpPanel setSelectedCmp={setSelectedCmp} />

        <PVFlexLayout setGridState={setGridState} selectedCmp={selectedCmp} />

        {showDashboardForm && (
          <FormDashboard
            saveDashboard={saveDashboard}
            setShowDashboardForm={setShowDashboardForm}
          />
        )}
        <button onClick={() => setShowDashboardForm(true)}>save state</button>
      </ModelViewStyles>
    </>
  );
};

const ModelViewStyles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;

  .layout {
    position: relative;
    top: 0rem;
    height: 30rem;
    width: 90%;
  }
`;

export default AdminView;
