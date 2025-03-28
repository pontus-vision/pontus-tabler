import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUser, readAuthGroups } from '../../client';
import Select from 'react-select';

const CreateUser = () => {
  const [userName, setUserName] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groups, setGroups] = useState([{ value: 'groupA', label: '...' }]);

  const { t } = useTranslation();

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleGroupChange = (selectedOptions) => {
    setSelectedGroups(selectedOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await createUser({
        name: userName,
        authGroups: selectedGroups,
      });
    } catch (error) { }
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

  return (
    <div className="create-user__container">
      <div className="create-user__form">
        <h2 className="create-user__form-title">{t('Register new user')}</h2>
        <form onSubmit={handleSubmit} className="create-user__form-fields">
          <div className="create-user__form-field">
            <label className="create-user__label">{t('Name')}</label>
            <input
              type="text"
              className="create-user__input"
              value={userName}
              onChange={handleUserNameChange}
              required
            />
          </div>
          <div className="create-user__form-field">
            <label className="create-user__label">{t('Select Group')}</label>
            <Select
              options={groups}
              isMulti
              onChange={handleGroupChange}
              value={selectedGroups}
              className="create-user__select"
            />
          </div>
          <button className="create-user__button">{t('Register')}</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
