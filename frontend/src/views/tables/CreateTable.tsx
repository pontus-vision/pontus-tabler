import { useEffect, useState } from 'react';
import { createTable, tableRead } from '../../client';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import {
  TableColumnRef,
  TableRef,
} from '../../pontus-api/typescript-fetch-client-generated';
import TableView from '../TableView';
import { OpenApiValidationFailError } from '../../types';
import { capitalizeFirstLetter } from '../../webinyApi';
import Alert, { AlertProps } from '../../components/MessageDisplay';

type Props = {
  testId?: string;
};

export const formatToCosmosDBPattern = (inputString: string) => {
  return inputString.trim().replace(/ /g, '-').toLowerCase();
};

const CreateTableView = ({ testId }: Props) => {
  const [cols, setCols] = useState<TableColumnRef[]>([]);
  const [name, setName] = useState<string>();
  const [errors, setErrors] = useState<OpenApiValidationFailError>();

  const [tables, setTables] = useState<TableRef[]>();
  const [validationError, setValidationError] = useState<Record<string, any>>(
    {},
  );
  const [message, setMessage] = useState<AlertProps>();

  const { t, i18n } = useTranslation();

  const handleInputChange = (e, field: string) => {
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

    try {
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

      setMessage({ message: 'Table created successfully!', type: 'success' });
    } catch (error) {
      setMessage({
        type: 'error',
        message: typeof error === 'string' ? error : '',
      });
      setTimeout(() => {
        setMessage({ message: '', type: undefined });
      }, 5000);
    }
  };

  const checkValidationError = (message: string) => {
    if (message.startsWith('required')) {
      return 'This field is required';
    } else if (message.startsWith('pattern')) {
      return 'Special characters are not allowed';
    }
  };

  const handleColsCreation = (data: TableColumnRef[]) => {
    setCols(data);
  };

  useEffect(() => {
    console.log({ validationError });
  }, [validationError]);

  return (
    <>
      <form
        className="create-table__form"
        onSubmit={(e) => {
          e.preventDefault();
          cols.length > 0 && handleCreate(cols);
        }}
      >
        <label htmlFor="">Name</label>
        <input
          data-testid={`${testId}-input`}
          onChange={(e) => {
            setName(e.target.value);
            name &&
              name?.length > 3 &&
              handleInputChange &&
              handleInputChange(e, 'name');
          }}
          onBlur={(e) => handleInputChange(e, 'name')}
          value={name}
          type="text"
          // pattern="^[a-z0-9]([-a-z0-9]{3,63}[a-z0-9])?$"
          // title="Please do not use special characters"
          // required
          className="create-table__name-input"
        />
        {validationError?.name && <p>{validationError.name}</p>}
        <TableView
          testId="table-view"
          onCreate={handleCreate}
          errors={errors}
          onColsCreation={handleColsCreation}
          validationError={validationError}
          onInputChange={handleInputChange}
        />
      </form>

      <Alert message={message?.message} type={message?.type} />
    </>
  );
};

export default CreateTableView;
