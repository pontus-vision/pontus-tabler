import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import {
  Meta,
  Dashboard,
  FlexLayoutCmp,
  IListModelResponseData,
} from '../types';
import { IJsonModel } from 'flexlayout-react';
import PVFlexLayout from '../pv-react/PVFlexLayout';
import { setDashboards } from '../store/sliceDashboards';
import FormDashboard from '../components/FormDashboard';
import CmpPanel from '../components/CmpPanel';
import { useTranslation } from 'react-i18next';
import NewEntryView from './NewEntryView';
import { ICmsGetContentModelDataField } from '../types';
import { AuthContext } from '../AuthContext';
import Unauthorized from './Unauthorized';
import { useParams } from 'react-router-dom';
import { readDashboard } from '../client';

export type getModelDataReturn = {
  columnNames: ICmsGetContentModelDataField[];
  modelContentListData: IListModelResponseData[];
  meta: Meta;
};

const AdminView = () => {
  const [gridState, setGridState] = useState<IJsonModel>();
  const [deletion, setDeletion] = useState(false);
  const [showDashboardForm, setShowDashboardForm] = useState(false);
  const [selectedCmp, setSelectedCmp] = useState<FlexLayoutCmp>();
  const { t, i18n } = useTranslation();

  const context = useContext(AuthContext);

  const dispatch = useDispatch();

  const saveDashboard = (name: string) => {
    if (!gridState) return;
    const id = 'id' + Math.random().toString(16).slice(2);
    const dashboard: Dashboard = {
      name,
      id,
      gridState,
    };
    console.log(dashboard);
    dispatch(setDashboards(dashboard));
  };

  useEffect(() => {
    console.log({ gridState });
  }, [gridState]);

  return (
    <div className="admin-view__container">
      {
        <>
          <CmpPanel setSelectedCmp={setSelectedCmp} />
          <PVFlexLayout
            deletion={deletion}
            setGridState={setGridState}
            selectedCmp={selectedCmp}
          />
          {showDashboardForm && (
            <FormDashboard
              saveDashboard={saveDashboard}
              setShowDashboardForm={setShowDashboardForm}
            />
          )}
          <button onClick={() => setShowDashboardForm(true)}>
            {t('save-state')}
          </button>
        </>
      }
    </div>
  );
};

export default AdminView;
