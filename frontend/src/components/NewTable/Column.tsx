import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { NewTableColumn } from '../../pontus-api/typescript-fetch-client-generated';

export interface TableCol {
  column: string;
  type: string;
  filter: boolean;
  sortable: boolean;
}

type Props = {
  setCols: Dispatch<
    SetStateAction<{ colId: string; colDef: NewTableColumn }[]>
  >;
  index: number;

  colDef?: NewTableColumn;
};

const NewTableCol = ({ setCols, index, colDef }: Props) => {
  const [header, setHeader] = useState<string>();
  const [filter, setFilter] = useState(colDef?.filter || false);
  const [sortable, setSortable] = useState(colDef?.sortable || false);

  useEffect(() => {
    setCols((prevState) =>
      prevState.map((col, idx) =>
        idx === index
          ? {
              colId: col.colId,
              colDef: {
                field: header,
                filter: filter,
                sortable: sortable,
                headerName: header,
                name: header,
                tableId: header,
              },
            }
          : col,
      ),
    );
  }, [header, filter, sortable]);

  useEffect(() => {
    console.log({ colDef });
  }, [colDef]);

  const deleteCol = () => {
    console.log('delete');
    setCols((prevState) => prevState.filter((col, idx) => idx !== index));
  };

  return (
    <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
      <td className=" px-6 text-left py-0">
        <div className="flex items-center h-3/4">
          <input
            onChange={(e) => setHeader(e.target.value)}
            type="text"
            className="bg-transparent border-2 font-normal"
            defaultValue={colDef?.headerName ? colDef?.headerName : ''}
          />
        </div>
      </td>
      <td className="py-3 px-6 text-left">
        <div className="flex items-center">
          <select name="" id="">
            <option>Checkboxes</option>
            <option>Selectbox</option>
            <option>Text</option>
            <option>Number</option>
            <option>Phone</option>
            <option>E-mail</option>
            <option>Zipcode</option>
          </select>
        </div>
      </td>
      <td className="py-3 px-6 text-center p-0 flex justify-center">
        {filter ? (
          <BsCheckCircleFill
            className="w-8 h-full"
            onClick={() => {
              setFilter(false);
            }}
          />
        ) : (
          <FaRegCircleXmark
            className="w-8 h-full"
            onClick={() => {
              setFilter(true);
            }}
          />
        )}
      </td>
      <td className="py-3 px-6 text-center">
        {sortable ? (
          <BsCheckCircleFill
            className="w-8 h-full left-1/2 relative -translate-x-1/2"
            onClick={() => {
              setSortable(false);
            }}
          />
        ) : (
          <FaRegCircleXmark
            className="w-8 h-full left-1/2 relative -translate-x-1/2"
            onClick={() => {
              setSortable(true);
            }}
          />
        )}
      </td>
      <td className="py-3 px-6 text-center">
        <div className="flex item-center justify-center">
          <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
            <svg
              onClick={() => deleteCol()}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default NewTableCol;
