import { useRef, useState } from 'react';
import DashboardView from '../DashboardView';
import { createDashboard, createMenu } from '../../client';
import { DashboardRef } from '../../pontus-api/typescript-fetch-client-generated';
import { useLocation } from 'react-router-dom';
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
  const [openTree, setOpenTree] = useState(false);
  const notificationManagerRef = useRef<MessageRefs>();

  const dashboardCreate = async (body: DashboardRef) => {
    console.log({ body, dashboardMenuItem });
    const folder = location?.state;
    try {
      if (!folder?.id) {
        if (!dashboardMenuItem) {
          notificationManagerRef?.current?.addMessage(
            'info',
            '',
            'Please, select a path!',
          );

          return;
        }
        const res = await createDashboard({
          menuItem: {
            ...dashboardMenuItem,
            children: [{ kind: 'file', name: newDashboardName }],
          },
          name: newDashboardName,
          folder: dashboardMenuItem.path?.endsWith('/')
            ? dashboardMenuItem.path + newDashboardName
            : dashboardMenuItem.path + '/' + newDashboardName,
          state: body.state,
        });
        if (res?.status !== 200) {
          console.log({ res });
          throw res;
        }
      } else {
        const res2 = await createMenu({
          path: folder.path,
          id: folder.id,
          dashboard: {
            folder: folder.path,
            name: newDashboardName,
            state: body.state,
            owner: body.owner,
          },
          children: [
            {
              kind: 'file',
              path: folder.path + newDashboardName,
              name: newDashboardName,
            },
          ],
        });

        if (res2?.status !== 200) {
          throw new Error();
        }
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
    setDashboardMenuItem(folder);
  };
  return (
    <>
      <label htmlFor="">Dashboard Name: </label>
      <input
        type="text"
        onChange={(e) => setNewDashboardName(e.target.value)}
      />
      {!location.state?.id && !openTree && (
        <IoIosFolderOpen onClick={() => setOpenTree(true)} />
      )}
      {!location.state?.id && openTree && (
        <div
          style={{
            width: '14rem',
            position: 'absolute',
            backgroundColor: 'white',
            zIndex: '2',
            boxShadow: '0px 0 2px  black',
          }}
        >
          <MenuTree onSelect={handleCreate} />
        </div>
      )}
      <DashboardView createMode={true} onDashboardCreate={dashboardCreate}  />
      <NotificationManager ref={notificationManagerRef} />
    </>
  );
};

export default CreateDashboard;
