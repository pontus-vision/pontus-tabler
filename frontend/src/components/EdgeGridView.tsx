import { ChangeEvent, useEffect, useState } from 'react';
import PVGridWebiny2 from '../pv-react/PVGridWebiny2';
import {
  TableRef,
  TableDataRowRef,
  TableReadRes,
  Edge,
  ReadPaginationFilterFilters,
  TableDataReadReq,
  TableDataReadRes,
} from '../typescript/api';
import { IGetRowsParams, IRowNode, RowEvent } from 'ag-grid-community';
import { tableDataRead } from '../client';
import useApiAndNavigate from '../hooks/useApi';
import { AxiosResponse } from 'axios';

export interface ListWithDropdownItem extends TableRef {
  id: string;
}
type Props = {
  options: TableReadRes[];
  onLoadedRows?: (rows: Record<string, any>[]) => void;
  onEdges?: (edges: string[]) => void;
  onTableSelect?: (tableName: string) => void;
  onFirstColId?: (colId: string) => void;
};

const EdgeGridView = ({
  options,
  onEdges,
  onLoadedRows,
  onTableSelect,
  onFirstColId,
}: Props) => {
  const [list, setList] = useState<TableDataRowRef[]>([]);
  const [dropdownValue, setDropdownValue] = useState<TableReadRes>();
  const [dropdownOptions, setDropdownOptions] = useState<TableReadRes[]>();
  const [selectedItemsArr, setSelectedItemsArr] = useState<
    Record<string, any>[]
  >([]);
  const [gridOpened, setGridOpened] = useState(false);
  const [filters, setFilters] = useState<{
    [key: string]: ReadPaginationFilterFilters;
  }>({});
  const [from, setFrom] = useState<number>(1);
  const [to, setTo] = useState<number>(8);
  const [selectedRows, setSelectedRows] = useState<IRowNode<any>[]>();
  const [isLoading, setIsLoading] = useState(false)
  const { fetchDataAndNavigate } = useApiAndNavigate();

  const fetchTableRows = async () => {
    if (!dropdownValue?.name || !from || !to || !filters) return;

    const req: TableDataReadReq = {
      tableName: dropdownValue?.name,
      from,
      to,
      filters,
    };
    setIsLoading(true)

    const res = (await fetchDataAndNavigate(
      tableDataRead,
      req,
    )) as AxiosResponse<TableDataReadRes>;

    setIsLoading(false)

    if (res?.status !== 200) {
      setList([]);
    } else {
      const rows = res?.data.rows as Record<string, any>[];

      const edges = rows?.map((row: any) => {
        const arr: string[] = [];
        for (const prop in row.edges) {
          for (const prop2 in row.edges[prop]) {
            arr.push(prop2);
          }
        }
        return [...new Set(arr)];
      })[0] as string[];

      rows && setList(rows);

      onLoadedRows(rows)

      onEdges && edges && onEdges(edges);
    }
  };
  useEffect(() => {
    fetchTableRows();
  }, [filters, from, to]);

  useEffect(() => {
    setDropdownOptions(options);
  }, [options]);

  const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const val = options.find((e) => e.id === value);

    setDropdownValue(undefined);
    setTimeout(() => {
      const edges = val?.edges;
      setDropdownValue(val);
      val?.name && onTableSelect && onTableSelect(val?.name);
    }, 1);
  };

  const addToSelectedItemsArr = (e: Record<string, any>) => {
    const { _rid, _self, _etag, _attachments, _ts, ...rest } = e;

    setSelectedItemsArr((prevState) => {
      if (!prevState.some((el) => el.id === e.id)) {
        return [...prevState, rest];
      } else {
        return prevState;
      }
    });
  };

  const handleParamsChange = (params: IGetRowsParams) => {
    setFilters(params.filterModel);
    setFrom(params.startRow + 1);
    setTo(params.endRow);
  };

  const handleRowsSelected = (e: IRowNode<any>[]) => {
    if (e.length === 0) return;
    setSelectedRows(e);
  };

  return (
    <div className="list-with-dropdown">
      <select onChange={handleDropdownChange}>
        <option value="">Select an option</option>
        {dropdownOptions?.map((option, index) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      {dropdownValue?.cols && (
        // <>
        //   <button onClick={() => setGridOpened(true)}>Open Grid</button>

        //   <div
        //     className={`list-with-dropdown__grid ${gridOpened ? '' : 'closed'}`}
        //   >
        //     <div
        //       onClick={() => setGridOpened(false)}
        //       className="list-with-dropdown__grid__close-btn"
        //     >
        //       <HiOutlineXMark />
        //     </div>
        <PVGridWebiny2
          onColumnState={(cols) => {
            console.log({ cols })
            const colId = cols.at(4)?.colId;
            console.log({ colId });
            colId && onFirstColId && onFirstColId(colId);
          }}
          isLoading={isLoading}
          onRowClicked={(e) => {
            console.log({ e })
            addToSelectedItemsArr(e.data)
          }}
          onRefresh={() => fetchTableRows()}
          rows={list}
          onParamsChange={handleParamsChange}

          onRowsSelected={handleRowsSelected}
          rowsSelected={selectedRows}
          cols={dropdownValue.cols}
        />
        //     </div>

        //     {selectedItemsArr.length > 0 && (
        //       <DragAndDropList
        //         items={selectedItemsArr.map((item) => {
        //           return { name: Object.values(item)[0], id: item.id };
        //         })}
        //       />
        //     )}
        //   </>
      )}
    </div>
  );
};

export default EdgeGridView;
