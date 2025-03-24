import { relative } from 'path/posix';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { generateUUIDv6 } from '../../../utils';
import {
  TableColumnRef,
  TableColumnRefKindEnum,
} from '../../pontus-api/typescript-fetch-client-generated';
import CustomNumberInput from '../components/CustomNumberInput';

export interface TableCol {
  column: string;
  type: string;
  filter: boolean;
  sortable: boolean;
}

type Props = {
  onSubmit?: boolean;
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
  colsLength: number
  setRenameCols?: Dispatch<SetStateAction<Record<string, string>>>;
  setAddCols?: Dispatch<SetStateAction<Record<string, Record<string, string>>>>;
  setDeleteCols?: Dispatch<SetStateAction<string[]>>
};

const NewTableCol = ({
  onInputChange,
  validationError,
  setCols,
  index,
  colDef,
  testId,
  setValidationError,
  colsLength,
  setRenameCols,
  setAddCols,
  setDeleteCols,
  onSubmit
}: Props) => {
  const [header, setHeader] = useState<string>(colDef?.headerName || '');
  const [field, setField] = useState<string>(colDef?.field || '');
  const [filter, setFilter] = useState(colDef?.filter || false);
  const [sortable, setSortable] = useState(colDef?.sortable || false);
  const [kind, setKind] = useState<TableColumnRefKindEnum>(
    colDef?.kind || 'checkboxes',
  );
  const [colNumber, setColNumber] = useState<number>()
  const [description, setDescription] = useState<string>()
  const [regex, setRegex] = useState<string>()
  const [openRegexField, setOpenRegexField] = useState(false)
  const [originalName, setOriginalName] = useState<string>()
  const [isNewCol, setIsNewCol] = useState(false)
  const [colUUID, setColUUID] = useState<string>()

  useEffect(() => {
    if (!setRenameCols || !originalName || isNewCol) return;
    setRenameCols((prevState) => {

      return {
        ...prevState,
        [originalName]: header
      }
    }

    )
  }, [header])


  useEffect(() => {
    if (!setAddCols || !isNewCol || !colUUID) return;

    setAddCols((prevState) => {

      return {
        ...prevState, [colUUID]: {
          [header]: kind
        }
      }
    }

    )
  }, [header, kind])


  useEffect(() => {
    const uuid = generateUUIDv6()
    setColUUID(uuid)
    setOriginalName(colDef.headerName)

    if (colDef?.newCol) {
      setIsNewCol(true)
    }
  }, [])

  useEffect(() => {
    if (!setCols) return;
    setCols((prevState) =>
      prevState?.map((col, idx) =>
        idx === index
          ? {
            ...col,
            field,
            filter: filter,
            sortable: sortable,
            headerName: header,
            name: header,
            id: col.id,
            kind,
            regex,
            description
          }
          : col,
      ),
    );
  }, [header, filter, sortable, kind, regex, description, field]);

  useEffect(() => {
    if (!setCols) return;
    setCols((prevState) =>
      prevState?.map((col, idx) => {
        console.log({ col, colDef })
        return col
        return (
          idx === index
            ? {
              ...col,
              field: header,
              filter: filter,
              sortable: sortable,
              headerName: header,
              name: header,
              id: col.id,
              kind,
            }
            : col)
      }
      ),
    );
  }, [colDef]);

  useEffect(() => {
    console.log({ colDef })
    if (!setCols) return;
    setCols((prevState) =>
      prevState?.map((col, idx) =>
        idx === index
          ? {
            field,
            filter: filter,
            sortable: sortable,
            headerName: header,
            name: header,
            id: col.id,
            kind,
            originalIndex: index,
            pivotIndex: index + 1,
            regex,
            description
          }
          : col,
      ),
    );
  }, []);

  const [position, setPosition] = useState<number>()

  const deleteCol = () => {
    if (!setCols) return;
    setCols((prevState) => prevState?.filter((col, idx) => idx !== index));
  };

  const formatToCosmosDBPattern = (inputString: string) => {
    return inputString.trim().replace(/ /g, '-').toLowerCase();
  };

  return (
    <>
      <tr data-testid={testId} className="table-row" key={index} style={{ position: 'relative', top: `${7.021 * (colDef?.pivotIndex - (colDef?.originalIndex + 1))}rem` }}>
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
                setField(e.target.value);
                field?.length > 3 &&
                  onInputChange &&
                  onInputChange(e, `field-col-${index}`, setValidationError);
              }}
              type="text"
              data-testid={`${testId}-input`}
              data-cy={`create-table-col-def-input-${index}`}
              className="table-row__input-field"
              defaultValue={colDef?.headerName}
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
            {(kind !== 'checkboxes' && kind !== 'selectbox') && <div style={{ position: openRegexField ? 'relative' : 'absolute', top: !openRegexField ? '1.8rem' : '0' }}>
              <label>Regex</label>
              <input type="checkbox" onChange={e => setOpenRegexField(e.target.checked)} />

            </div>
            }
            {

              openRegexField && <>
                <input type="text" onChange={(e) => { setRegex(e.target.value) }} />
              </>
            }
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
        <td style={{ position: 'relative', width: '2rem' }}>
          <CustomNumberInput min={1} max={colsLength} value={colDef?.pivotIndex || index + 1} onChange={(val) => {
            setCols((prevState) =>
              prevState?.map((col, idx, arr) => {
                console.log({ colDefVal: colDef?.pivotIndex })
                const inputValue = +val;

                // Skip the current moving item
                if (idx === index) {
                  setColNumber(inputValue)
                  return {
                    ...col,
                    pivotIndex: inputValue,
                  };
                }

                // Shift other elements accordingly
                if (col.pivotIndex >= inputValue && col.pivotIndex < colDef.pivotIndex) {
                  setColNumber(col.pivotIndex + 1)
                  return { ...col, pivotIndex: col.pivotIndex + 1 }; // Shift right
                } else if (col.pivotIndex <= inputValue && col.pivotIndex > colDef.pivotIndex) {
                  setColNumber(col.pivotIndex - 1)
                  return { ...col, pivotIndex: col.pivotIndex - 1 }; // Shift left
                }

                return col;
              }
              ),
            );
          }} />
        </td>
        <td className='table-row__description'>
          <textarea onChange={(e) => { setDescription(e.target.value) }} />
        </td>
        <td className="table-row__data--center">
          <div className="table-row__flex-container">
            <div className="table-row__icon--transform">
              <svg
                onClick={() =>{
                  setDeleteCols((prevState) => {
                    if(!Array.isArray(prevState)) {return}
                    return[...prevState,originalName]});
              deleteCol()
                }}
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

    </>
  );
};

export default NewTableCol;
