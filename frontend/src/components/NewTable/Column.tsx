import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { TableColumnRef } from '../../pontus-api/typescript-fetch-client-generated';

export interface TableCol {
  column: string;
  type: string;
  filter: boolean;
  sortable: boolean;
}

type Props = {
  setCols?: Dispatch<SetStateAction<TableColumnRef[]>>;
  index: number;
  colDef?: TableColumnRef;
  testId?: string;
};

const NewTableCol = ({ setCols, index, colDef, testId }: Props) => {
  const [header, setHeader] = useState<string>(colDef?.headerName || '');
  const [filter, setFilter] = useState(colDef?.filter || false);
  const [sortable, setSortable] = useState(colDef?.sortable || false);
  const [kind, setKind] = useState<TableColumnRef.KindEnum>(
    colDef?.kind || TableColumnRef.KindEnum.Checkboxes,
  );

  useEffect(() => {
    if (!setCols) return;

    setCols((prevState) =>
      prevState?.map((col, idx) =>
        idx === index
          ? {
              field: header,
              filter: filter,
              sortable: sortable,
              headerName: header,
              name: header,
              tableId: header,
              id: col.id,
              kind,
            }
          : col,
      ),
    );
  }, [header, filter, sortable, kind]);

  useEffect(() => {
    console.log({ colDef });
  }, [colDef]);

  const deleteCol = () => {
    if (!setCols) return;
    setCols((prevState) => prevState?.filter((col, idx) => idx !== index));
  };

  return (
    <tr data-testid={testId} className="table-row">
      <td className="table-row__data--padded">
        <div className="table-row__flex-container">
          <input
            onChange={(e) => setHeader(e.target.value)}
            type="text"
            data-testid={`${testId}-input`}
            className="table-row__input-field"
            defaultValue={colDef?.headerName ? colDef?.headerName : ''}
          />
        </div>
      </td>
      <td className="table-row__data--left">
        <div className="table-row__flex-container">
          <select
            defaultValue={colDef?.kind || 'checkboxes'}
            onChange={(e) => {
              const value = e.target.value as any;
              setKind(value);
            }}
            data-testid={`${testId}-dropdown`}
            name=""
            id=""
          >
            <option value={TableColumnRef.KindEnum.Checkboxes}>
              Checkboxes
            </option>
            <option value={TableColumnRef.KindEnum.Selectbox}>Selectbox</option>
            <option value={TableColumnRef.KindEnum.Text}>Text</option>
            <option value={TableColumnRef.KindEnum.Number}>Number</option>
            <option value={TableColumnRef.KindEnum.Phone}>Phone</option>
            <option value={TableColumnRef.KindEnum.Email}>E-mail</option>
            <option value={TableColumnRef.KindEnum.Zipcode}>Zipcode</option>
          </select>
        </div>
      </td>
      <td className="table-row__data--center">
        {filter ? (
          <BsCheckCircleFill
            // className="table-row__icon--full-size"
            className="table-row__filter-icon--checked"
            onClick={() => {
              setFilter(false);
            }}
          />
        ) : (
          <FaRegCircleXmark
            className="table-row__filter-icon--unchecked"
            onClick={() => {
              setFilter(true);
            }}
          />
        )}
      </td>
      <td className="table-row__data--center">
        {sortable ? (
          <BsCheckCircleFill
            className="table-row__sort-icon--checked"
            onClick={() => {
              setSortable(false);
            }}
          />
        ) : (
          <FaRegCircleXmark
            className="table-row__sort-icon--unchecked"
            onClick={() => {
              setSortable(true);
            }}
          />
        )}
      </td>
      <td className="table-row__data--center">
        <div className="table-row__flex-container">
          <div className="table-row__icon--transform">
            <svg
              onClick={() => deleteCol()}
              data-testid={`${testId}-delete-btn`}
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
