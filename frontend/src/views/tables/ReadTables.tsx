import { useEffect, useRef, useState } from 'react';
import PVFlexLayout from '../../pv-react/PVFlexLayout';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import {
  BaseModelRef,
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
  TableDeleteReq,
  TableRef,
  TableUpdateReq,
  User,
} from '../../pontus-api/typescript-fetch-client-generated';
import { deleteTable, getTables } from '../../client';
import { ColDef, IGetRowsParams, RowEvent } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from '../../helpers/functions';

import NotificationManager, {
  MessageRefs,
} from '../../components/NotificationManager';

type Props = {
  rowsTested?: any[];
};

const TablesReadView = ({ rowsTested }: Props) => {
  const [cols, setCols] = useState<ColDef[]>([
    { headerName: 'Name', field: 'label', filter: true },
  ]);
  const [rows, setRows] = useState<TableRef[]>();
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({});
  const [from, setFrom] = useState<number>(1);
  const [to, setTo] = useState<number>(8);
  const [totalCount, setTotalCount] = useState<number>();
  const notificationManagerRef = useRef<MessageRefs>();
  const navigate = useNavigate();

  const fetchTables = async () => {
    console.log('fetching');
    try {
      if (rowsTested) {
        throw 'No rows';
      }
      const req: ReadPaginationFilter = {
        from,
        to,
        filters,
      };

      const data = await getTables(req);

      const entries = data?.data?.tables; // setCols([...cols, ...data?.data.tables?.map()])

      setRows(entries || []);
      setTotalCount(data?.data.totalTables || 1);
    } catch {
      setRows([]);
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
        console.log({ el });
        const res = await deleteTable(el);
        if (index === arr.length - 1 && res?.status === 200) {
          const message = `Table${
            arr.length > 1 ? 's' : ''
          } deleted successfully.`;

          notificationManagerRef?.current?.addMessage(
            'success',
            'Success',
            message,
          );
        }
      } catch (error: any) {
        if (error?.code === 500) {
          notificationManagerRef?.current?.addMessage(
            'error',
            'Error',
            'Could not delete',
          );
        }
      }
    });

    fetchTables();
  };

  return (
    <>
      <div className="read-tables__container">
        <PVGridWebiny2
          testId="read-tables-aggrid"
          onUpdate={handleUpdate}
          totalCount={totalCount}
          onParamsChange={handleParamsChange}
          onRefresh={handleOnRefresh}
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
        <NotificationManager ref={notificationManagerRef} />
      </div>
    </>
  );
};

export default TablesReadView;
