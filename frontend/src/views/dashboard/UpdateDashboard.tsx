import { useParams } from 'react-router-dom';
import { updateDashboard } from '../../client';
import {
  DashboardRef,
  DashboardUpdateReq,
} from '../../pontus-api/typescript-fetch-client-generated';
import DashboardView from '../DashboardView';
import { useState } from 'react';

const UpdateDashboard = () => {
  const { id } = useParams();
  const [newDashboardName, setNewDashboardName] = useState<string>();

  const saveDashboard = async (obj: DashboardRef) => {
    if (!id) return;
    try {
      const res = await updateDashboard({
        ...obj,
        id,
        name: newDashboardName || obj.name,
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
      <DashboardView onDashboardSave={saveDashboard} />
    </>
  );
};

export default UpdateDashboard;
