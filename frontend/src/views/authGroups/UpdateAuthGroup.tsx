import { useParams } from 'react-router-dom';
import { readAuthGroup, updateAuthGroup } from '../../client';
import AuthGroupForm from './AuthGroupForm';
import { useEffect, useState } from 'react';
import {
  NewGroup,
  UpdateGroup,
} from '../../pontus-api/typescript-fetch-client-generated';

const UpdateAuthGroup = () => {
  const { id } = useParams();
  const [name, setName] = useState<string>();
  const [symlinks, setSymlinks] = useState();
  const [parents, setParents] = useState();

  useEffect(() => {
    const fetchAuthGroup = async () => {
      try {
        const res = await readAuthGroup({ groupId: id });
        console.log(res?.data.name);

        setName(res?.data.name || '');
      } catch (error) {
        console.error(error);
      }
    };

    fetchAuthGroup();
  }, []);

  useEffect(() => {
    console.log({ name });
  }, [name]);

  const updateGroup = async (body: NewGroup) => {
    try {
      const data = updateAuthGroup({ ...body, groupId: id });

      console.log(data, body);
    } catch (error) {
      console.error;
    }
  };

  return (
    <div className="flex flex-col items-center h-full justify-center">
      <AuthGroupForm
        onSubmit={updateGroup}
        values={{ name, parents, symlinks }}
      />
    </div>
  );
};

export default UpdateAuthGroup;
