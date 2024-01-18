import { useNavigate, useParams } from 'react-router-dom';
import PVGridWebiny2 from '../../../pv-react/PVGridWebiny2';
import { useEffect, useState } from 'react';
import { tableDataCreate, tableDataRead, tableRead } from '../../../client';
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

  useEffect(() => {
    if (!tableId) return;

    const fetchTable = async (tableId: string) => {
      try {
        const res = await tableRead({ id: tableId });
        const colsRes = res?.data.cols?.map((col) => {
          return { ...col, editable: true };
        });

        setTable(res?.data);
        console.log({ res: res?.data });
        setCols(colsRes);
        setTableName(res?.data.name || '');
      } catch (error) {}
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
      console.log({ res });
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
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    if (!tableName) return;
    console.log({ tableName });
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
      const res = await tableDataCreate({
        tableName: table?.name,
        cols: data,
      });

      console.log({ res, cols: data });
    } catch (error) {}
  };

  return (
    <>
      {table?.cols && (
        <PVGridWebiny2
          onParamsChange={handleParamsChange}
          rows={rows}
          cols={table?.cols}
          add={goToCreateTableDataView}
          permissions={{ createAction: true }}
          totalCount={rowCount}
        />
      )}
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
