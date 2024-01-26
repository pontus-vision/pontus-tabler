import { ChangeEvent, useRef, useState } from 'react';
import { createTable } from '../../client';
import { useTranslation } from 'react-i18next';
import {
  TableColumnRef,
  TableRef,
} from '../../pontus-api/typescript-fetch-client-generated';
import TableView from '../TableView';
import { OpenApiValidationFailError } from '../../types';
import NotificationManager, {
  MessageRefs,
} from '../../components/NotificationManager';

type Props = {
  testId?: string;
};

export const formatToCosmosDBPattern = (inputString: string) => {
  return inputString.trim().replace(/ /g, '-').toLowerCase();
};

const CreateTableView = ({ testId }: Props) => {
  const [name, setName] = useState<string>();
  const [errors, setErrors] = useState<OpenApiValidationFailError>();
  const notificationManagerRef = useRef<MessageRefs>();
  const [validationError, setValidationError] = useState<Record<string, any>>(
    {},
  );

  const { t, i18n } = useTranslation();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const inputValue = e.target.value;

    const pattern = /^[a-zA-Z0-9 ]{3,63}$/;
    if (!pattern.test(inputValue)) {
      setValidationError((prevState) => ({
        ...prevState,
        [field]:
          'Please enter only letters, numbers, and spaces (3 to 63 characters).',
      }));
    } else {
      setValidationError((prevState) => ({
        ...prevState,
        [field]: '',
      }));
    }
  };

  const handleCreate = async (data: TableColumnRef[]) => {
    const isAnyFieldInvalid = Object.values(validationError).some(
      (field) => field,
    );
    if (isAnyFieldInvalid) return;

    let colsEmpty = false;

    for (const [key, value] of Object.entries(data)) {
      console.log({ key, value });
      if (!value.headerName) {
        colsEmpty = true;
      }
    }

    try {
      if (!name || colsEmpty) {
        throw `Please, there are some empty fields.`;
      }

      const obj = {
        label: name || '',
        name: formatToCosmosDBPattern(name || ''),
        cols: data.map((col) => {
          return {
            ...col,
            name: formatToCosmosDBPattern(col.name || ''),
            field: formatToCosmosDBPattern(col.name || ''),
          };
        }),
      };
      const createRes = await createTable(obj);

      if (createRes?.status === 400) {
        throw new Error();
      } else if (createRes?.status === 409) {
        throw 'There is already a table with that Name';
      }

      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        'Table created!',
      );
    } catch (error: any) {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        typeof error === 'string' ? error : 'Could not create table',
      );
    }
  };

  return (
    <>
      <div className="create-table-view">
        <label htmlFor="">Name</label>
        <input
          data-testid={`${testId}-input`}
          data-cy="create-table-name-input"
          onChange={(e) => {
            setName(e.target.value);
            name &&
              //   name?.length > 3 &&
              handleInputChange &&
              handleInputChange(e, 'name');
          }}
          onBlur={(e) => handleInputChange(e, 'name')}
          value={name}
          type="text"
          className="create-table__name-input"
        />
        {validationError?.[`name`] && (
          <p className="table-input-tooltip">{validationError?.[`name`]}</p>
        )}
        <TableView
          testId="table-view"
          onCreate={handleCreate}
          validationError={validationError}
          onInputChange={handleInputChange}
        />
      </div>
      <NotificationManager ref={notificationManagerRef} />
    </>
  );
};

export default CreateTableView;
