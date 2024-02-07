import { useEffect, useRef, useState } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import { tableRead, updateTable } from '../../client';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TableColumnRef,
  TableRef,
  TableUpdateReq,
} from '../../pontus-api/typescript-fetch-client-generated';
import TableView from '../TableView';
import { formatToCosmosDBPattern } from './CreateTable';
import NotificationManager, {
  MessageRefs,
} from '../../components/NotificationManager';

type Props = {
  tableId?: string;
};

const UpdateTableView = ({ tableId }: Props) => {
  const [cols, setCols] = useState<TableColumnRef[]>([]);
  const [table, setTable] = useState<TableRef>();
  const [tables, setTables] = useState<TableRef[]>();
  const [name, setName] = useState<string>();
  const [newName, setNewName] = useState<string>();
  const [validationError, setValidationError] = useState<Record<string, any>>(
    {},
  );
  const params = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const notificationManagerRef = useRef<MessageRefs>();

  const fetchTable = async (id: string) => {
    const data = await tableRead({ id });
    setTable(data?.data);

    data?.data.cols && setCols(data?.data.cols);
    data?.data.name && setName(data?.data.name);
  };

  useEffect(() => {
    if (params.id || tableId) {
      fetchTable(params.id || tableId || '');
    }
  }, [params, tableId]);

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

  const handleUpdate = async (data: TableRef) => {
    try {
      const obj: TableUpdateReq = {
        ...data,
        id: params.id || tableId || '',
        name: formatToCosmosDBPattern(newName || name || ''),
        label: name,
        cols: data?.cols?.map((col) => {
          return {
            ...col,
            name: formatToCosmosDBPattern(col.name || ''),
            field: formatToCosmosDBPattern(col.name || ''),
          };
        }),
      };
      const updateRes = await updateTable(obj);
      if (updateRes?.status === 400) {
        throw 'Some error in the form';
      } else if (updateRes?.status === 409) {
        throw 'There is already a table with that Name';
      }

      notificationManagerRef?.current?.addMessage(
        'success',
        'Success',
        'Table updated successfully',
      );
    } catch (error: any) {
      notificationManagerRef?.current?.addMessage('error', 'Success', error);
    }
  };

  const navigateToTables = () => {
    navigate('/tables/read');
  };

  return (
    <>
      <input
        onChange={(e) => setNewName(e.target.value)}
        type="text"
        defaultValue={name}
        data-testid="update-table-view-input"
        className="update-table__name-input"
      />
      <TableView
        validationError={validationError}
        onInputChange={handleInputChange}
        onUpdate={handleUpdate}
        testId="update-view"
        table={table}
      />
      <div className="update-table__tables-read-btn" onClick={navigateToTables}>
        <IoChevronBackOutline />
        {t('Tables')}
      </div>
      <NotificationManager ref={notificationManagerRef} />
    </>
  );
};

export default UpdateTableView;
