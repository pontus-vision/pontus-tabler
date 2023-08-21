import { IJsonModel } from 'flexlayout-react';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CmpPanel from '../components/CmpPanel';
import PVFlexLayout from '../pv-react/PVFlexLayout';
import { RootState } from '../store/store';
import { Dashboard, FlexLayoutCmp } from '../types';
import { useTranslation } from 'react-i18next';
import NewEntryView from './NewEntryView';
import { useAuth } from '../AuthContext';
import {
  getDashboard,
  updateDashboard,
  deleteDashboard,
  createDashboard,
} from '../client';
import { UpdateDashboard } from '../pontus-api/typescript-fetch-client-generated';
import Alert from 'react-bootstrap/esm/Alert';

type Props = {
  dashboardId?: string;
  dashboardName?: string;
  createMode?: boolean;
};

const DashboardView = ({ dashboardName, createMode }: Props) => {
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
  const [folder, setFolder] = useState<string>();
  const [name, setName] = useState<string>();
  const [successMsg, setSuccessMsg] = useState<string>();
  const [owner, setOwner] = useState<string>();

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
    console.log({ isEditing });
  }, [isEditing]);
  const saveEdition = async () => {
    if (gridState) {
      if (id) {
        const obj: UpdateDashboard = {
          dashboardId: id,
          state: gridState,
          folder,
          name,
          owner,
        };
        try {
          const data = await updateDashboard(obj);

          if (data?.status === 200) {
            setSuccessMsg('updated!');
            setTimeout(() => {
              setSuccessMsg('');
            }, 4000);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        createNewDashboard();
      }
    }
  };

  const createNewDashboard = async () => {
    try {
      const data = await createDashboard({
        folder,
        name: dashboardName,
        owner,
        state: gridState,
      });

      if (data?.status === 200) {
        setSuccessMsg('created!');
        setTimeout(() => {
          setSuccessMsg('');
        }, 4000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const delDashboard = async () => {
    if (!id) return;
    try {
      const data = await deleteDashboard(id);

      if (data?.status === 200) {
        setSuccessMsg('Deleted!');
        setTimeout(() => {
          setSuccessMsg('');
        }, 4000);
      }
    } catch (error) {
      console.error(error);
    }
    setDeleteModal(false);
  };

  const [initialState, setInitialState] = useState<IJsonModel>();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    const fetchDashboard = async () => {
      const res = await getDashboard(id);

      setName(res?.data.name || '');

      setInitialState(
        res?.data.gridState || {
          global: {},
          borders: [],
          layout: {
            type: 'row',
            id: '#a880b6c8-8981-4ea8-93c4-810a7ac41e3f',
            children: [
              {
                type: 'row',
                id: '#63ec4f08-7081-4557-b2c0-6fe74bf2893e',
                children: [
                  {
                    type: 'tabset',
                    id: '#3155bc6f-ea47-4e9b-822e-bc023ced5e60',
                    children: [
                      {
                        type: 'tab',
                        id: '#ba731bfa-a493-445b-a74f-dcf042b53593',
                        name: 'name',
                        component: 'PVGridWebiny2',
                        config: {
                          title: 'name',
                          tableId: 'tableId',
                          lastState: [],
                          height: 249,
                        },
                      },
                    ],
                  },
                  {
                    type: 'tabset',
                    id: '#f6d34c55-6a57-4266-bc09-ad5099853b89',
                    children: [
                      {
                        type: 'tab',
                        id: '#ca5bdcac-9cd2-4b7a-861a-034b6117af34',
                        name: 'name',
                        component: 'PVGridWebiny2',
                        config: {
                          title: 'name',
                          tableId: 'tableId',
                          lastState: [],
                          height: 249,
                        },
                      },
                    ],
                    active: true,
                  },
                ],
              },
            ],
          },
        },
      );
    };

    fetchDashboard();
  }, [id]);

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
          {!createMode && (
            <Button onClick={() => setDeleteModal(true)}>
              {t('delete-dashboard')}
            </Button>
          )}
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
            <button
              className="actions-panel__save"
              onClick={() => saveEdition()}
            >
              {t('save-state')}
            </button>
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
        setIsEditing={setIsEditing}
        gridState={initialState}
      />

      <Alert
        className={`success-msg ${successMsg ? 'active' : ''}`}
        variant="success"
      >
        {successMsg}
      </Alert>

      {modelId && <NewEntryView setModelId={setModelId} modelId={modelId} />}
    </div>
  );
};

export default DashboardView;
