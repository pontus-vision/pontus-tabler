import { useState } from 'react';
import DashboardView from '../DashboardView';
import { createDashboard } from '../../client';
import { DashboardRef } from '../../pontus-api/typescript-fetch-client-generated';

const CreateDashboard = () => {
  const [newDashboardName, setNewDashboardName] = useState<string>();

  const dashboardCreate = async (body: DashboardRef) => {
    try {
      const res = await createDashboard({
        ...body,
        name: newDashboardName || body?.name,
      });

      console.log({ res });
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
