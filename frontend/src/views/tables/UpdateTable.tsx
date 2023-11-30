import { useEffect, useState } from 'react';
import NewTableCol from '../../components/NewTable/Column';
import { IoChevronBackOutline } from 'react-icons/io5';
import { getTable, getTables, updateTable } from '../../client';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../../webinyApi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  TableColumnRef,
  TableRef,
  TableUpdateReq,
} from '../../pontus-api/typescript-fetch-client-generated';
import TableView from '../TableView';

type Props = {
  tableId?: string;
};

const UpdateTableView = ({ tableId }: Props) => {
  const [cols, setCols] = useState<TableColumnRef[]>([]);
  const [table, setTable] = useState<TableRef>();
  const [tables, setTables] = useState<TableRef[]>();
  const [name, setName] = useState<string>();

  const params = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const fetchTable = async (id: string) => {
    const data = await getTable(id);
    setTable(data?.data);
    console.log({ data });

    data?.data.cols && setCols(data?.data.cols);
  };

  useEffect(() => {
    if (params.id || tableId) {
      fetchTable(params.id || tableId || '');
    }
  }, [params, tableId]);

  useEffect(() => {
    setName(table?.name);
  }, [table]);

  const handleUpdate = async (data: TableRef) => {
    const updateRes = await updateTable({ ...data, id: params.id, name });
  };

  const navigateToTables = () => {
    navigate('/tables/read');
  };

  // if (!table) return;

  return (
    <>
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        value={name}
        data-testid="update-table-view"
        className="update-table__name-input"
      />
      <TableView onUpdate={handleUpdate} testId="update-view" table={table} />
      <div className="update-table__tables-read-btn" onClick={navigateToTables}>
        <IoChevronBackOutline />
        {t('Tables')}
      </div>
    </>
  );
};

export default UpdateTableView;
