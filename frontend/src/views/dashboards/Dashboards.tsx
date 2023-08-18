import { useEffect, useState } from 'react';
import PVGridWebiny2 from '../../pv-react/PVGridWebiny2';
import {
  ReadPaginationFilter,
  ReadPaginationFilterFilters,
} from '../../pontus-api/typescript-fetch-client-generated';
import { ColDef, RowEvent } from 'ag-grid-community';
import { getAllDashboards } from '../../client';
import { capitalizeFirstLetter } from '../../webinyApi';

const Dashboards = () => {
  const [cols, setCols] = useState<ColDef[]>([
    {
      headerName: 'Owner',
      field: 'owner',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Folder',
      field: 'folder',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Name',
      field: 'name',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Id',
      field: 'id',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'State',
      field: 'state',
      filter: true,
      sortable: true,
    },
  ]);
  const [rows, setRows] = useState<{ [key: string]: unknown }[]>();
  const [filters, setFilters] = useState<ReadPaginationFilterFilters>();
  const [from, setFrom] = useState<number>();
  const [to, setTo] = useState<number>();
  const [totalCount, setTotalCount] = useState<number>(2);

  const [rowClicked, setRowClicked] = useState<RowEvent>();

  useEffect(() => {
    const fetchDashboars = async () => {
      console.log('fetching');
      try {
        const req: ReadPaginationFilter = {
          from,
          to,
          filters,
        };
        const res = await getAllDashboards(req);

        const obj: ColDef[] = res?.data?.dashboards
          .map((dashboard) => {
            return Object.keys(dashboard);
          })[0]
          .map((header) => {
            const obj: ColDef = {
              headerName: capitalizeFirstLetter(header),
              field: header,
              filter: true,
              sortable: true,
            };
            return obj;
          });

        setRows(res?.data.dashboards);
        console.log({ cols: obj, rows: res?.data.dashboards });

        // setCols(obj);

        console.log({ filters, to, from });
      } catch (error) {}
    };

    fetchDashboars();
  }, [filters, to, from]);

  useEffect(() => {
    console.log({ from, to });
  }, [from, to]);

  useEffect(() => {
    console.log({ rowClicked });
  }, [rowClicked]);

  if (!rows) return;

  return (
    <>
      <PVGridWebiny2
        totalCount={totalCount}
        rows={rows}
        cols={cols}
        setFilters={setFilters}
        setFrom={setFrom}
        setTo={setTo}
        setRowClicked={setRowClicked}
      />
      {/* <ul>{rows.map((row) => row)}</ul> */}
    </>
  );
};

export default Dashboards;
