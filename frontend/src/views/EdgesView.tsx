import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { getTables, tableDataEdgeCreate } from '../client';
import EdgeGridView from '../components/EdgeGridView';
import {
  AuthGroupTablesReadReq,
  ReadPaginationFilter,
  TableDataEdgeCreateReq,
  TableReadRes,
  TablesReadRes,
} from '../typescript/api';

import Select from 'react-select';
import TableRelationshipsPreview from './TableRelationshipsPreview';
import { EdgeConnectionType } from '../typescript/api/resources/pontus/types/EdgeConnectionType';
import NotificationManager, {
  MessageRefs,
} from '../components/NotificationManager';
import useApiAndNavigate from '../hooks/useApi';
import { AxiosResponse } from 'axios';

const EdgesView = () => {
  const [tableOptions, setTableOptions] = useState<TableReadRes[]>([]);
  const [selectInput, setSelectInput] = useState('');
  const [rows1, setRows1] = useState<Record<string, any>[]>([]);
  const [rows2, setRows2] = useState<Record<string, any>[]>([]);
  const [tableFrom, setTableFrom] = useState<string>();
  const [tableTo, setTableTo] = useState<string>();
  const [edgesKey, setEdgesKey] = useState<string[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<string>();
  const [selectedEdgeType, setSelectedEdgeType] =
    useState<EdgeConnectionType>('oneToOne');
  const [tableFromColId, setTableFromColId] = useState<string>('');
  const [tableToColId, setTableToColId] = useState<string>('');
  const notificationManagerRef = useRef<MessageRefs>();

  const { fetchDataAndNavigate } = useApiAndNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const req: ReadPaginationFilter = {
      from: 1,
      to: 57,
      filters: {},
    };

    const res = (await fetchDataAndNavigate(
      getTables,
      req,
    )) as AxiosResponse<TablesReadRes>;

    const tables = res?.data.tables as TableReadRes[] | undefined;
    tables && setTableOptions(tables);
  };

  const handleEdgesList = (edges: string[]) => {
    setEdgesKey(edges);
  };

  const selectInputEnterHandle = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code.toLocaleLowerCase() === 'enter') {
      setEdgesKey([...edgesKey, selectInput]);
    }
  };

  const createEdges = async () => {
    if (!tableFrom || !tableTo || !selectedEdge) return;
    const obj: TableDataEdgeCreateReq = {
      edge: selectedEdge,
      edgeType: selectedEdgeType,
      tableFrom: { rows: rows1, tableName: tableFrom },
      tableTo: { rows: rows2, tableName: tableTo },
    }

    const res = await tableDataEdgeCreate(obj);

    notificationManagerRef?.current?.addMessage(
      'success',
      'Success',
      'Edge(s) created!',
    );
  };

  return (
    <div className="edges-view">
      <div className="edges-view__panel">
        <div className="select-tables-container">
          <div className="select-tables-container__col" data-cy="select-tables-container-1">
            from:
            <EdgeGridView
              onFirstColId={(e) => { setTableFromColId(e) }}
              onLoadedRows={(e) => {
                setRows1(e)
              }}
              options={tableOptions}
              onTableSelect={(e) => {
                setTableFrom(e)
              }}
              onEdges={handleEdgesList}
            />
          </div>
          <div className="select-tables-container__select">
            <Select
              placeholder={'Select Edge'}
              onChange={(e) => setSelectedEdge(e?.value)}
              onKeyDown={(e) => selectInputEnterHandle(e)}
              onInputChange={(e) => setSelectInput(e)}
              options={edgesKey?.map((edge) => {
                return { value: edge.toLowerCase(), label: edge };
              })}
            />
            <TableRelationshipsPreview
              onSelect={(e) => setSelectedEdgeType(e)}
              array1={rows1.map((el, index) => el?.[tableFromColId])}
              array2={rows2.map((el, index) => el?.[tableToColId])}
            />
          </div>
          <div className="select-tables-container__col" data-cy="select-tables-container-2">
            to:
            <EdgeGridView
              onFirstColId={(e) => {
                setTableToColId(e)
              }}
              options={tableOptions}
              onLoadedRows={(e) => setRows2(e)}
              onTableSelect={(e) => setTableTo(e)}
            />
          </div>
        </div>
      </div>
      <NotificationManager ref={notificationManagerRef} />
      <button onClick={() => createEdges()}>Create</button>
    </div>
  );
};

export default EdgesView;
