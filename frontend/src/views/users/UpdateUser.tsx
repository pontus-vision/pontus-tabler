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
    <div className="update-user__container">
      <div className="update-user__form">
        <h2 className="update-user__form-title">Update User</h2>
        <form onSubmit={handleSubmit} className="update-user__form-fields">
          <div className="update-user__form-field">
            <label className="update-user__label">{t('Name')}</label>
            <input
              type="text"
              className="update-user__input"
              value={userName}
              onChange={handleUserNameChange}
              required
            />
          </div>
          <div className="update-user__form-field">
            <label className="update-user__label">{t('Select Group')}</label>
            <Select
              options={groups}
              isMulti
              onChange={handleGroupChange}
              value={selectedGroups}
              className="update-user__select"
            />
          </div>
          <button className="update-user__button">{t('Register')}</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
