import { useEffect, useRef, useState } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import { tableRead, updateTable } from '../../client';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TableColumnRef,
  TableRef,
  TableUpdateReq,
} from '../../typescript/api';
import TableView from '../TableView';
import { formatToCosmosDBPattern } from './CreateTable';
import NotificationManager, {
  MessageRefs,
} from '../../components/NotificationManager';
import { TableColumnCrud } from '../../typescript/api';

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
    try {
      const data = await tableRead({ id });
      setTable(data?.data);

      data?.data.cols && setCols(data?.data.cols.sort((a, b) => a.pivotIndex - b.pivotIndex));
      data?.data.label && setName(data?.data.label);
    } catch (error) {
      notificationManagerRef?.current?.addMessage('error', 'Error', JSON.stringify(error));
    }
  };

  useEffect(() => {
    console.log({ table })
  }, [table])
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

  const handleUpdate = async (data: TableColumnRef[], tableColsCrud: TableColumnCrud) => {
    console.log({ data, newName, name })
    try {
      const obj: TableUpdateReq = {
        id: params.id || tableId || '',
        name: newName || name || '',
        label: newName || name || '',
        cols: data?.map((col) => {
          return {
            ...col,
            headerName: col.headerName || '',
            field: col.field || '',
          };
        }),
        tableColsCrud
      };

      console.log({ obj })

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
      console.log({ error })
      notificationManagerRef?.current?.addMessage('error', 'Success', JSON.stringify(error));
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
        data-cy="update-table-view-input"
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
