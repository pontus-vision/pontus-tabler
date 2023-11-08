import { useParams } from 'react-router-dom';
import { updateDashboard } from '../../client';
import {
  DashboardRef,
  DashboardUpdateReq,
} from '../../pontus-api/typescript-fetch-client-generated';
import DashboardView from '../DashboardView';

const UpdateDashboard = () => {
  const { id } = useParams();

  const saveDashboard = async (obj: DashboardRef) => {
    if (!id) return;
    try {
      const res = await updateDashboard({ ...obj, id });

      console.log({ res });
    } catch (error) {}
  };
  return (
    <>
      <DashboardView onDashboardSave={saveDashboard} />
    </>
  );
};

export default UpdateDashboard;
