import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUser, readAuthGroups, updateUser } from '../../client';
import Select from 'react-select';
import { useLocation, useParams } from 'react-router-dom';

const UpdateUser = () => {
  const [userName, setUserName] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groups, setGroups] = useState([{ value: 'groupA', label: '...' }]);

  const { t } = useTranslation();
  const { id } = useParams();

  const location = useLocation();

  const handleUserNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleGroupChange = (selectedOptions) => {
    setSelectedGroups(selectedOptions);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateUserData();
  };

  const updateUserData = async () => {
    return updateUser({
      authGroups: selectedGroups.map((el) => el.value),
      name: userName,
      userId: id,
    });
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
