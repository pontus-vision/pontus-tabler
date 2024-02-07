import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaRegCircleXmark } from 'react-icons/fa6';
import {
  TableColumnRef,
  TableColumnRefKindEnum,
} from '../../pontus-api/typescript-fetch-client-generated';

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
  onInputChange?: (
    e: ChangeEvent<HTMLInputElement>,
    field: string,
    setValidationError: Dispatch<SetStateAction<Record<string, any>>>,
  ) => void;
  validationError: Record<string, any>;
  setValidationError: Dispatch<SetStateAction<Record<string, any>>>;
};

const NewTableCol = ({
  onInputChange,
  validationError,
  setCols,
  index,
  colDef,
  testId,
  setValidationError,
}: Props) => {
  const [header, setHeader] = useState<string>(colDef?.headerName || '');
  const [filter, setFilter] = useState(colDef?.filter || false);
  const [sortable, setSortable] = useState(colDef?.sortable || false);
  const [kind, setKind] = useState<TableColumnRefKindEnum>(
    colDef?.kind || 'checkboxes',
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
              id: col.id,
              kind,
            }
          : col,
      ),
    );
  }, [header, filter, sortable, kind]);

  const deleteCol = () => {
    if (!setCols) return;
    setCols((prevState) => prevState?.filter((col, idx) => idx !== index));
  };

  const formatToCosmosDBPattern = (inputString: string) => {
    return inputString.trim().replace(/ /g, '-').toLowerCase();
  };

  return (
    <tr data-testid={testId} className="table-row">
      <td className="table-row__data--padded">
        <div className="table-row__flex-container">
          <input
            onBlur={(e) =>
              onInputChange &&
              onInputChange(e, `header-col-${index}`, setValidationError)
            }
            onChange={(e) => {
              setHeader(e.target.value);
              header?.length > 3 &&
                onInputChange &&
                onInputChange(e, `header-col-${index}`, setValidationError);
            }}
            type="text"
            data-testid={`${testId}-input`}
            data-cy={`create-table-col-def-input-${index}`}
            className="table-row__input-field"
            defaultValue={colDef?.headerName ? colDef?.headerName : ''}
          />
          {validationError?.[`header-col-${index}`] && (
            <p className="table-row__flex-container__tooltip">
              {validationError?.[`header-col-${index}`]}
            </p>
          )}
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
            data-cy={`create-table-col-def-type-${index}`}
            name=""
            id=""
          >
            <option value={'checkboxes'}>Checkboxes</option>
            <option value={'selectbox'}>Selectbox</option>
            <option value={'text'}>Text</option>
            <option value={'number'}>Number</option>
            <option value={'phone'}>Phone</option>
            <option value={'email'}>E-mail</option>
            <option value={'zipcode'}>Zipcode</option>
          </select>
        </div>
      </td>
      <td className="table-row__data--center">
        {filter ? (
          <BsCheckCircleFill
            className="table-row__filter-icon--checked"
            data-cy={`create-table-col-def-filter-on-${index}`}
            onClick={() => {
              setFilter(false);
            }}
          />
        ) : (
          <FaRegCircleXmark
            className="table-row__filter-icon--unchecked"
            data-cy={`create-table-col-def-filter-off-${index}`}
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
            data-cy={`create-table-col-def-sort-on-${index}`}
            onClick={() => {
              setSortable(false);
            }}
          />
        ) : (
          <FaRegCircleXmark
            className="table-row__sort-icon--unchecked"
            data-cy={`create-table-col-def-sort-off-${index}`}
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
