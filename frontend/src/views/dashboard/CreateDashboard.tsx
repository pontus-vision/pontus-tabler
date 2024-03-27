import { useState } from 'react';
import DashboardView from '../DashboardView';
import { createDashboard, createMenu } from '../../client';
import { DashboardRef } from '../../pontus-api/typescript-fetch-client-generated';
import { useLocation } from 'react-router-dom';

const CreateDashboard = () => {
  const [newDashboardName, setNewDashboardName] = useState<string>();

  const location = useLocation();

  const dashboardCreate = async (body: DashboardRef) => {
    try {
      const folder = location.state;
      console.log({ folder, location });

      // const res = await createDashboard({
      //   ...body,
      //   name: newDashboardName || body?.name,
      //   folder: folder.path,
      // });

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
    } catch (error) {}
  };

  return (
    <>
      <label htmlFor="">Dashboard Name: </label>
      <input
        type="text"
        onChange={(e) => setNewDashboardName(e.target.value)}
      />
      <DashboardView createMode={true} onDashboardCreate={dashboardCreate} />
    </>
  );
};

export default CreateDashboard;
