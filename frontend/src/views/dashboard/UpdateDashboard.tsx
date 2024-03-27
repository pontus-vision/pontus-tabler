import { useParams } from 'react-router-dom';
import { updateDashboard } from '../../client';
import {
  DashboardRef,
  DashboardUpdateReq,
} from '../../pontus-api/typescript-fetch-client-generated';
import DashboardView from '../DashboardView';
import { useEffect, useState } from 'react';

const UpdateDashboard = () => {
  const { id } = useParams();
  const [newDashboardName, setNewDashboardName] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1);
  }, [id]);

  const saveDashboard = async (obj: DashboardRef) => {
    if (!id) return;
    try {
      const res = await updateDashboard({
        ...obj,
        id,
      });

      console.log({ res });
    } catch (error) {}
  };
  return <>{!loading && <DashboardView onDashboardSave={saveDashboard} />}</>;
};

export default UpdateDashboard;
