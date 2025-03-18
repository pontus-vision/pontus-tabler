import { useEffect, useRef, useState } from 'react';
import DashboardView from '../DashboardView';
import { createDashboard, createMenu } from '../../client';
import { DashboardRef } from '../../pontus-api/typescript-fetch-client-generated';
import { useLocation, useParams } from 'react-router-dom';
import MenuTree from '../../components/MenuTree';
import { MenuItemTreeRef } from '../../typescript/api';
import NotificationManager, {
  MessageRefs,
} from '../../components/NotificationManager';
import { IoIosFolderOpen } from 'react-icons/io';

const CreateDashboard = () => {
  const [newDashboardName, setNewDashboardName] = useState<string>();
  const [dashboardMenuItem, setDashboardMenuItem] = useState<MenuItemTreeRef>();
  const location = useLocation();
  const { id } = useParams()
  const [openTree, setOpenTree] = useState(false);
  const notificationManagerRef = useRef<MessageRefs>();
  const [menuState, setMenuState] = useState<MenuItemTreeRef>()

  useEffect(() => {
    const state = location.state

    setMenuState(state)
  }, [])

  const dashboardCreate = async (body: DashboardRef) => {
    const folder = location?.state;
    console.log({ menuState, folder, dashboardMenuItem })
    try {
      if (!menuState && !dashboardMenuItem?.path) {
        notificationManagerRef?.current?.addMessage(
          'info',
          '',
          'Please, select a path!',
        );

        return;
      }
      const obj = {
        id,
        name: menuState?.name || newDashboardName,
        folder: menuState?.path || dashboardMenuItem?.path,
        state: body.state,
      }
      console.log({ obj })

      const res = await createDashboard(obj);
      if (res?.status !== 200) {
        throw res;
      }
      if (!menuState) {
        const res2 = await createMenu({
          path: dashboardMenuItem?.path,
          name: menuState?.name || newDashboardName,
          id: dashboardMenuItem.id,
          kind: 'file',
        })
        console.log({ res2 })
      }
      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        'Dashboard Created!',
      );
    } catch (error) {
      console.error({ error });
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Something went wrong. Dashboard Could not created!',
      );
    }
  };

  const handleCreate = async (folder: MenuItemTreeRef) => {
    if (folder.kind === 'folder') {
      console.log({ folder })
      setDashboardMenuItem(folder);
    }
  };

  return (
    <>
      {!menuState ? <div>
        <label htmlFor="">Dashboard Name: </label>
        <input
          data-cy="dashboard-view-name-input"
          type="text"
          onChange={(e) => setNewDashboardName(e.target.value)}
        />
      </div> :
        <label className='dashboard__name'>{menuState?.name}</label>
      }
      {!openTree && dashboardMenuItem && menuState?.path && <label>Location Path: '{dashboardMenuItem?.path}'</label>}
      {
        !location.state?.id && !openTree && (
          <IoIosFolderOpen data-cy="dashboard-view-open-directory" onClick={() => setOpenTree(true)} />
        )
      }
      {
        !location.state?.id && openTree && (
          <div
            data-cy="dashboard-view-close-tree"
            onClick={() => setOpenTree(false)}
            style={{
              width: '100%',
              position: 'absolute',
              backgroundColor: '#00000099',
              zIndex: '3',
              height: '100%',
              top: '-50%',
              left: '-50%',
              transform: 'translate(50%,50%)'
            }}
          >
          </div>
        )
      }
      {
        !location.state?.id && openTree && (
          <div
            style={{
              width: '30%',
              height: '50%',
              position: 'absolute',
              backgroundColor: 'white',
              zIndex: '3',
              boxShadow: '0px 0 2px  black',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)'
            }}
          >
            <MenuTree onSelect={handleCreate} selectionOnly={true} />
            {dashboardMenuItem && <div>
              <label>Folder selected: {dashboardMenuItem.name}</label>
            </div>}
          </div>
        )
      }
      <DashboardView createMode={true} onDashboardCreate={dashboardCreate} />
      <NotificationManager ref={notificationManagerRef} />
    </>
  );
};

export default CreateDashboard;
