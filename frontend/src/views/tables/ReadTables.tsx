import { useEffect, useRef, useState } from 'react';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import {
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
  TableRef,
  TableUpdateReq,
} from '../../typescript/api';
import { createTable, deleteTable, getTables, updateTable } from '../../client';
import { ColDef, IGetRowsParams, RowEvent, SortModelItem } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';

import NotificationManager, {
  MessageRefs,
} from '../../components/NotificationManager';
import useApiAndNavigate from '../../hooks/useApi';
import { formatToCosmosDBPattern } from './CreateTable';
import { useTranslation } from 'react-i18next';

type Props = {
  rowsTested?: any[];
  notificationManagerRef?: React.RefObject<MessageRefs>;
};

const TablesReadView = ({ rowsTested, notificationManagerRef }: Props) => {
  const { t } = useTranslation()
  const [cols, setCols] = useState<ColDef[]>([
    { headerName: t('Name'), field: 'label', filter: true },
    { field: 'id', hide: true }
  ]);
  const [rows, setRows] = useState<TableRef[]>();
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({});
  const [sort, setSort] = useState<SortModelItem[]>()
  const [from, setFrom] = useState<number>(1);
  const [to, setTo] = useState<number>(8);
  const [totalCount, setTotalCount] = useState<number>();
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const { fetchDataAndNavigate } = useApiAndNavigate()

  const fetchTables = async () => {
    try {
      if (rowsTested) {
        throw 'No rows';
      }
      const req: ReadPaginationFilter = {
        from,
        to,
        filters: { name: { ...filters['label'] } },
        sortModel: sort
      };

      setIsLoading(true)

      const data = await fetchDataAndNavigate(getTables, req)

      const entries = data?.data?.tables; // setCols([...cols, ...data?.data.tables?.map()])

      setRows(entries || []);
      setTotalCount(data?.data.totalTables || 1);
    } catch (error) {
      setRows([]);
      setTotalCount(1)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchTables();
  }, [filters, from, to]);

  const handleUpdate = (data: TableUpdateReq) => {
    data?.id && navigate('/table/update/' + data.id, { state: data });
  };

  const handleOnRefresh = () => {
    fetchTables();
  };

  const handleParamsChange = (params: IGetRowsParams) => {
    setSort(params.sortModel)
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };

  const handleRowClicked = (row: RowEvent<any, any>) => {
    row?.data?.id && navigate(`/table/data/read/${row.data.id}`);
  };

  const handleAddition = () => {
    navigate('/table/create');
  };

  const handleDelete = async (arr: { id: string; name: string }[]) => {
    arr.forEach(async (el, index) => {
      try {
        const res = await deleteTable({ id: el.id, name: el.name });
        if (index === arr.length - 1 && res?.status === 200) {
          notificationManagerRef?.current?.addMessage(
            'success',
            t('Success'),
            t('Table(s) deleted successfully'),
          );
        }
      } catch (error: any) {
        if (error?.code === 500) {
          notificationManagerRef?.current?.addMessage(
            'error',
            t('Error'),
            t('Could not delete'),
          );
        }
      }
    });

    fetchTables();
  };

  const handleCreateRow = async (state: Record<string, any>) => {
    try {
      const res = await fetchDataAndNavigate(createTable, { name: formatToCosmosDBPattern(state['label']), label: state['label'], cols: [] })
      notificationManagerRef?.current?.addMessage(
        'success',
        t('Saved'),
        t('Table saved') + ".",
      );
    } catch (error) {
      notificationManagerRef?.current?.addMessage(
        'error',
        t('Error'),
        t('Could not create table'),
      );
    }
  }
  const handleUpdateRow = async (state: Record<string, any>) => {
    try {
      console.log({ state })
      const res = await fetchDataAndNavigate(updateTable, { name: formatToCosmosDBPattern(state['label']), label: state['label'], cols: state['cols'], id: state['id'] })
      notificationManagerRef?.current?.addMessage(
        'success',
        t('Saved'),
        t('Table updated'),
      );
    } catch (error) {
      console.log({ error })
      notificationManagerRef?.current?.addMessage(
        'error',
        t('Error'),
        t('Could not delete'),
      );
    }
  }

  return (
    <>
      <div className="read-tables__container">
        <PVGridWebiny2
          testId="read-tables-aggrid"
          onUpdate={handleUpdate}
          totalCount={totalCount}
          onParamsChange={handleParamsChange}
          isLoading={isLoading}
          onRefresh={handleOnRefresh}
          onCreateRow={e => handleCreateRow(e)}
          onUpdateRow={e => handleUpdateRow(e)}
          cols={cols}
          onDelete={handleDelete}
          onRowClicked={handleRowClicked}
          rows={rows}
          add={handleAddition}
          permissions={{
            updateAction: true,
            createAction: true,
            deleteAction: true,
            readAction: true,
          }}
        />
      </div>
      <button style={{ marginTop: '2rem', transform: 'translateX(-50%)', position: 'relative', left: '50%' }} type='button' onClick={e => navigate('/table/edges')}>{t('Create Edges')}</button>
    </>
  );
};

export default TablesReadView;
