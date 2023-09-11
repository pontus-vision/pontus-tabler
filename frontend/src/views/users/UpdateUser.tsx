import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUser, readAuthGroups, updateUser } from '../../client';
import Select from 'react-select';
import { useLocation, useParams } from 'react-router-dom';

const UpdateUser = () => {
  const [userName, setUserName] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groups, setGroups] = useState([
    { value: 'groupA', label: 'Group A' },
    { value: 'groupB', label: 'Group B' },
    { value: 'groupC', label: 'Group C' },
  ]);

  const { t } = useTranslation();
  const { id } = useParams();

  const location = useLocation();

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleGroupChange = (selectedOptions) => {
    setSelectedGroups(selectedOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    updateUserData();
  };

  const updateUserData = async () => {
    try {
      const data = await updateUser({
        authGroups: selectedGroups.map((el) => el.value),
        name: userName,
        userId: id,
      });

      return data;
    } catch (error) {
      console.error;
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await readAuthGroups({});

        const arrInputs = res?.data.authGroups?.map((authGroup, index) => {
          return {
            value: index === 0 ? authGroup.groupId || '' : 'name 2',
            label: authGroup.name || '',
          };
        });

        if (arrInputs) {
          setGroups(arrInputs);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    setUserName(location.state.name);
    setSelectedGroups(
      location.state.authGroups.split(', ').map((el) => {
        return { value: el, label: el };
      }),
    );
  }, [location]);

  useEffect(() => {
    console.log({ groups });
  }, [groups]);

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="w-1/2 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Update User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Name')}
            </label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring focus:border-blue-300"
              value={userName}
              onChange={handleUserNameChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Select Group')}
            </label>
            <Select
              options={groups}
              isMulti
              onChange={handleGroupChange}
              value={selectedGroups}
              className="mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            {t('Register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
