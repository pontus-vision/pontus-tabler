import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import BootstrapForm from "react-bootstrap/Form";
import {
  ModelContentList,
  ModelColName,
  ModelContentListData,
  Meta,
  WebinyModel,
  Dashboard,
} from "../types";
import { getModels } from "../client";
import Form from "../components/Form";
import { useParams } from "react-router-dom";
import GridExample from "../components/Aggrid-teste";
import ReactDOM from "react-dom";
import { Layout, Model, TabNode, IJsonModel } from "flexlayout-react";
import PVFlexLayout from "../pv-react/PVFlexLayout";
import Button from "react-bootstrap/esm/Button";
import { setDashboards } from "../store/sliceDashboards";
import FormDashboard from "../components/FormDashboard";

export type GetModelFieldsReturn = {
  columnNames: ModelColName[];
  modelContentListData: ModelContentListData[];
  meta: Meta;
};

const AdminView = () => {
  const [gridState, setGridState] = useState<IJsonModel>();
  const [models, setModels] = useState<WebinyModel[]>();
  const [selectedModel, setSelectedModel] = useState<WebinyModel>();
  const [showDashboardForm, setShowDashboardForm] = useState(false);

  const dispatch = useDispatch();

  const fetchModels = async () => {
    const { data } = await getModels();
    const listModels = data.data.listContentModels.data;

    setModels(listModels);
    return data;
  };

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    console.log({ gridState });
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
        <BootstrapForm.Select
          onChange={(e) => setSelectedModel(JSON.parse(e.target.value))}
          size="lg"
        >
          {models &&
            models.map((model, index) => (
              <option key={index} value={JSON.stringify(model)}>
                {model.name}
              </option>
            ))}
        </BootstrapForm.Select>
        <div className="layout">
          <PVFlexLayout
            setGridState={setGridState}
            selectedModel={selectedModel}
          />
        </div>
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
