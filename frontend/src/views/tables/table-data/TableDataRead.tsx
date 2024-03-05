import { useNavigate, useParams } from 'react-router-dom';
import PVGridWebiny2 from '../../../pv-react/PVGridWebiny2';
import { useEffect, useRef, useState } from 'react';
import {
  deleteTable,
  tableDataCreate,
  tableDataDelete,
  tableDataRead,
  tableRead,
} from '../../../client';
import {
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
  TableColumnRef,
  TableDataCreateReq,
  TableDataReadReq,
  TableDataRowRef,
  TableRef,
} from '../../../pontus-api/typescript-fetch-client-generated';
import { IGetRowsParams } from 'ag-grid-community';
import NewEntryView from '../../NewEntryView';
import NotificationManager, {
  MessageRefs,
} from '../../../components/NotificationManager';

const TableDataReadView = () => {
  const [cols, setCols] = useState<TableColumnRef[]>();
  const tableId = useParams().id;
  const [tableName, setTableName] = useState<string>('');
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({});
  const [rows, setRows] = useState<Record<string, any>[]>();
  const [rowCount, setRowCount] = useState<number>();
  const navigate = useNavigate();
  const [table, setTable] = useState<TableRef>();
  const [from, setFrom] = useState<number>(1);
  const [to, setTo] = useState<number>(8);
  const notificationManagerRef = useRef<MessageRefs>();

  useEffect(() => {
    if (!tableId) return;

    const fetchTable = async (tableId: string) => {
      try {
        const res = await tableRead({ id: tableId });
        const colsRes = res?.data.cols?.map((col) => {
          return { ...col, editable: true };
        });

        setTable(res?.data);
        setCols(colsRes);
        setTableName(res?.data.name || '');

        console.log({ res: res?.data });
      } catch (error: any) {
        notificationManagerRef?.current?.addMessage(
          'error',
          'Error',
          'Could not fetch meta-data',
        );
      }
    };
    fetchTable(tableId);
  }, [tableId]);

  const fetchTableData = async () => {
    try {
      const obj: TableDataReadReq = {
        tableName: tableName,
        filters,
        from,
        to,
      };
      const res = await tableDataRead(obj);
      if (res?.status === 404) {
        setRowCount(1);
        setRows([]);
        return;
      }

      const dataRows = res?.data.rows?.map((row) => {
        const { _rid, _self, _etag, _attachments, _ts, ...rest } = row;

        return rest;
      });

      setRows(dataRows);
      setRowCount(res?.data.rowsCount);
      console.log({ res: dataRows });
    } catch (error: any) {
      if (error?.code === 500) {
        notificationManagerRef?.current?.addMessage(
          'error',
          'Error',
          'Could not fetch Table data.',
        );
      }
    }
  };

  useEffect(() => {
    if (!tableName) return;
    fetchTableData();
  }, [tableName, filters, to, from]);

  const handleParamsChange = (params: IGetRowsParams) => {
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };

  const [createRow, setCreateRow] = useState(false);

  const goToCreateTableDataView = () => {
    if (!tableId) return;
    setCreateRow(true);
  };

  const closeNewEntryView = () => {
    setCreateRow(false);
  };
  const createTableDataRow = async (data: TableDataRowRef) => {
    try {
      if (!table?.name) return;
      const obj: TableDataCreateReq = {
        tableName: table?.name,
        cols: data,
      };
      const res = await tableDataCreate(obj);

      if (res?.status === 200) {
        fetchTableData();
        notificationManagerRef?.current?.addMessage(
          'success',
          'Sucess',
          'Table row created.',
        );
        closeNewEntryView();
      }
    } catch (error) {
      notificationManagerRef?.current?.addMessage(
        'error',
        'Error',
        'Table row could not be created.',
      );
    }
  };

  const handleDelete = (arr: TableColumnRef[]) => {
    arr.forEach(async (el, index) => {
      if (!el?.id || !table?.name) return;
      try {
        const res = await tableDataDelete({
          rowId: el?.id,
          tableName: table?.name,
        });
        if (index === arr.length - 1) {
          notificationManagerRef?.current?.addMessage(
            'success',
            'Sucess',
            `Row${arr.length > 1 ? 's' : ''} deleted successfully`,
          );
        }
      } catch (error: any) {
        if (error?.code === 500) {
          notificationManagerRef?.current?.addMessage(
            'error',
            'Error',
            `Could not delete row${arr.length > 1 ? 's' : ''}`,
          );
        }
      }
    });

    fetchTableData();
  };

  return (
    <>
      <div className="table-data-read-view">
        <label className="table-data-read-view__title">{table?.label}</label>
        {table?.cols && (
          <PVGridWebiny2
            onParamsChange={handleParamsChange}
            rows={rows}
            cols={cols}
            add={goToCreateTableDataView}
            onDelete={handleDelete}
            permissions={{ createAction: true, deleteAction: true }}
            totalCount={rowCount}
            onRefresh={fetchTableData}
          />
        )}
      </div>
      <NotificationManager ref={notificationManagerRef} />
      {createRow && table && (
        <NewEntryView
          onSubmit={createTableDataRow}
          table={table}
          onClose={closeNewEntryView}
        />
      )}
    </>
  );
};

export default TableDataReadView;
