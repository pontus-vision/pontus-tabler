import { IJsonModel } from 'flexlayout-react';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CmpPanel from '../components/CmpPanel';
import PVFlexLayout from '../pv-react/PVFlexLayout';
import { deleteDashboard, updateDashboard } from '../store/sliceDashboards';
import { RootState } from '../store/store';
import { Dashboard, FlexLayoutCmp } from '../types';
import { useTranslation } from 'react-i18next';
import NewEntryView from './NewEntryView';
import { useAuth } from '../AuthContext';

type Props = {
  dashboardId: string;
};

const DashboardView = () => {
  const { value: dashboards, dashboardId } = useSelector(
    (state: RootState) => state.dashboards,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [addCmp, setAddCmp] = useState(false);
  const [dashboard, setDashboard] = useState<Dashboard>();
  const [gridState, setGridState] = useState<IJsonModel>();
  const [selectedCmp, setSelectedCmp] = useState<FlexLayoutCmp>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [modelId, setModelId] = useState<string | undefined>();

  const { userRole } = useAuth();

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    setDashboard(dashboards.find((el) => el.id === dashboardId));
  }, [dashboardId]);

  useEffect(() => {
    console.log({ dashboard });
  }, [dashboard]);

  useEffect(() => {
    console.log(modelId);
  }, [modelId]);

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
    navigate('/');
  };

  return (
    <div className="dashboard-view">
      <h1 className="title">{dashboard?.name}</h1>
      {userRole === 'Admin' && (
        <div className="actions-panel">
          {addCmp && <div className="shadow-mobile"></div>}
          {addCmp && <CmpPanel setSelectedCmp={setSelectedCmp} />}
          {!addCmp && (
            <i onClick={() => setAddCmp(true)} className="fa-light fa-plus"></i>
          )}
          <Button onClick={() => setDeleteModal(true)}>
            {t('delete-dashboard')}
          </Button>
          {deleteModal && (
            <div className="delete-dashboard-modal">
              <label>{dashboard?.name}</label>
              <label>{t('confirm-delete')}</label>
              <div className="delete-dashboard-modal__options">
                <button onClick={() => delDashboard()}>{t('yes')}</button>
                <Button onClick={() => setDeleteModal(false)}>{t('no')}</Button>
              </div>
            </div>
          )}
          {isEditing && (
            <Button
              className="actions-panel__save"
              onClick={() => saveEdition()}
            >
              {t('save-state')}
            </Button>
          )}
        </div>
      )}
      {modelId && (
        <div
          className="shadow"
          onClick={() => {
            console.log('hey');
            setModelId('');
          }}
        ></div>
      )}
      <PVFlexLayout
        setModelId={setModelId}
        selectedCmp={selectedCmp}
        setGridState={setGridState}
        gridState={dashboard?.gridState}
        setIsEditing={setIsEditing}
      />

      {modelId && <NewEntryView setModelId={setModelId} modelId={modelId} />}
    </div>
  );
};

export default DashboardView;
