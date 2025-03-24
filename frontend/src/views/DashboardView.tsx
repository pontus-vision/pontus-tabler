import { IJsonModel } from 'flexlayout-react';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CmpPanel from '../components/CmpPanel';
import PVFlexLayout from '../pv-react/PVFlexLayout';
import { RootState } from '../store/store';
import { FlexLayoutCmp } from '../types';
import { useTranslation } from 'react-i18next';
import NewEntryView from './NewEntryView';
import { useAuth } from '../AuthContext';
import {
  readDashboard,
  deleteDashboard,
  createDashboard,
  readDashboardGroupAuth,
  readUser,
} from '../client';
import {
  DashboardDeleteReq,
  DashboardRef,
} from '../pontus-api/typescript-fetch-client-generated';
import Alert from 'react-bootstrap/esm/Alert';

type Props = {
  dashboardId?: string;
  dashboardName?: string;
  createMode?: boolean;
  onDashboardCreate?: (body: DashboardRef) => void;
  onDashboardSave?: (body: DashboardRef) => void;
  onDashboardDelete?: (body: DashboardDeleteReq) => void;
};

const DashboardView = ({
  dashboardName,
  createMode,
  onDashboardCreate,
  onDashboardSave,
  onDashboardDelete,
}: Props) => {
  const { value: dashboards, dashboardId } = useSelector(
    (state: RootState) => state.dashboards,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [addCmp, setAddCmp] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardRef>();
  const [gridState, setGridState] = useState<IJsonModel>();
  const [selectedCmp, setSelectedCmp] = useState<FlexLayoutCmp>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [modelId, setModelId] = useState<string | undefined>();
  const [folder, setFolder] = useState<string>();
  const [name, setName] = useState<string>();
  const [successMsg, setSuccessMsg] = useState<string>();
  const [owner, setOwner] = useState<string>();
  const location = useLocation()
  const [createAction, setCreateAction] = useState(false);
  const [readAction, setReadAction] = useState(false);
  const [updateAction, setUpdateAction] = useState(true);
  const [deleteAction, setDeleteAction] = useState(false);

  const [deletion, setDeletion] = useState();
  const [initialState, setInitialState] = useState<IJsonModel>();
  const { id } = useParams();

  const { userGroups: userRole } = useAuth();

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    setDashboard(dashboards.find((el) => el.id === dashboardId));
  }, [dashboardId]);

  // const saveEdition = async () => {
  //   if (gridState) {
  //     if (id) {
  //       const obj: DashboardUpdateReq = {
  //         id,
  //         state: gridState || dashboard?.state,
  //         folder: folder || dashboard?.folder,
  //         name: name || dashboard?.name,
  //         owner: owner || dashboard?.name,
  //       };
  //       try {
  //         if (!updateAction) {
  //           throw new Error('Delete is not allowed for the user.');
  //         }
  //         const data = await updateDashboard(obj);

  //         if (data?.status === 200) {
  //           setSuccessMsg('updated!');
  //           setTimeout(() => {
  //             setSuccessMsg('');
  //           }, 4000);
  //         }
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     } else {
  //       createNewDashboard();
  //     }
  //   }
  // };

  const createNewDashboard = async () => {
    try {
      // if (!createAction) {
      //   throw new Error('Create is not allowed for the user.');
      // }
      const data = await createDashboard({
        folder,
        name: dashboardName,
        owner,
        state: gridState,
        id: location.state.id
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
      // if (!deleteAction) {
      //   throw new Error('Delete is not allowed for the user.');
      // }
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

  useEffect(() => {
    const groupPermissions = async (dashboardId: string) => {
      const res = await readDashboardGroupAuth(dashboardId);
      const dashboardPermissions = res?.data.authGroups;
      const res2 = await readUser({ userId: 'user1' });
      const userGroups = res2?.data.authGroups;

      const del = dashboardPermissions?.delete?.some((dashboard) =>
        userGroups?.some((group) => group === dashboard),
      );
      const updt = dashboardPermissions?.update?.some((dashboard) =>
        userGroups?.some((group) => group === dashboard),
      );
      const create = dashboardPermissions?.create?.some((dashboard) =>
        userGroups?.some((group) => group === dashboard),
      );
      const read = dashboardPermissions?.read?.some((dashboard) =>
        userGroups?.some((group) => group === dashboard),
      );

      del && setDeleteAction(del);
      create && setCreateAction(create);
      read && setReadAction(read);
      updt && setUpdateAction(updt);
    };
    dashboard && id && groupPermissions(id);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchDashboard = async () => {
      try {
        const res = await readDashboard(id);

        if (res?.status !== 200) {
          setName(res?.data.name || '');
          setDashboard(res?.data);

          setInitialState({
            global: {},
            borders: [],
            layout: {
              type: 'row',
              id: '#a880b6c8-8981-4ea8-93c4-810a7ac41e3f',
              children: [],
            },
          });
        }
        setName(res?.data.name || '');
        setDashboard(res?.data);

        setInitialState(
          res?.data.state || {
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
      } catch (error) {
        if (error?.status === 404) {
          console.log({ error })
          const state = location.state
          navigate('/dashboard/create/' + id, { state: { ...state } })
        }
      }
    };

    fetchDashboard();
  }, [id]);


  const handleDashboardCreate = () => {
    const obj: DashboardRef = {
      state: gridState || dashboard?.state,
      folder: folder || dashboard?.folder,
      name: name || dashboard?.name,
      owner: owner || dashboard?.owner,
    };

    onDashboardCreate && onDashboardCreate(obj);
  };

  const handleDashboardSave = () => {
    const obj: DashboardRef = {
      state: gridState || dashboard?.state,
      folder: folder || dashboard?.folder,
      name: name || dashboard?.name,
      owner: owner || dashboard?.owner,
    };

    onDashboardSave && onDashboardSave(obj);
  };

  return (
    <div className="dashboard-view">
      <h1 className="title">{dashboard?.name}</h1>

      {userRole.some(role => role.name === 'Admin') && (
        <div className="actions-panel">
          {/* {addCmp && <div className="shadow-mobile"></div>} */}
          {updateAction && (
            <CmpPanel setSelectedCmp={setSelectedCmp} />
          )}
          {onDashboardSave && (
            <button
              className="actions-panel__delete-btn"
              onClick={() => delDashboard()}
            >
              {t('delete-dashboard')}
            </button>
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
          {updateAction && isEditing && (
            <button
              className="actions-panel__save"
              onClick={() => {
                onDashboardCreate && handleDashboardCreate();
                onDashboardSave && handleDashboardSave();
              }}
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
            setModelId('');
          }}
        ></div>
      )}
      <PVFlexLayout
        permissions={{ updateAction, createAction, deleteAction, readAction }}
        setModelId={setModelId}
        setDeletion={setDeletion}
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

      {modelId && <NewEntryView setModelId={setModelId} tableId={modelId} />}
    </div>
  );
};

export default DashboardView;
