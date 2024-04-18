import { Dispatch, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { BsFillTrash2Fill } from 'react-icons/bs';
import { GrUpdate } from 'react-icons/gr';
import { FaPlusCircle } from 'react-icons/fa';
import { IRowNode } from 'ag-grid-community';
import { IoIosSave } from 'react-icons/io';

type Props = {
  deleteMode?: boolean;
  updateMode?: boolean;
  setGridKey?: Dispatch<React.SetStateAction<number>>;
  setFlexModelId?: Dispatch<React.SetStateAction<string | undefined>>;
  setOpenNewEntryView?: React.Dispatch<React.SetStateAction<boolean>>;
  setModelId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  updateModelId?: string | undefined;
  setDeletion?: Dispatch<React.SetStateAction<boolean>>;
  id?: string;
  setShowColumnSelector?: Dispatch<React.SetStateAction<boolean>>;
  setDeleteMode?: Dispatch<React.SetStateAction<boolean>>;
  setUpdateMode?: Dispatch<React.SetStateAction<boolean>>;
  onRefresh?: () => void;
  configTableId?: string;
  add?: () => void;
  permissions?: {
    updateAction?: boolean;
    createAction?: boolean;
    deleteAction?: boolean;
    readAction?: boolean;
  };
  onDelete?: (arr: any[]) => void;
  entriesToBeDeleted: IRowNode<any>[];
  testId?: string;
  changesMade?: boolean;
  updateModeOnRows?: boolean;
};

const GridActionsPanel = ({
  deleteMode,
  onRefresh,
  updateMode,
  setGridKey,
  setFlexModelId,
  setOpenNewEntryView,
  setModelId,
  updateModelId,
  setDeletion,
  id,
  add,
  setShowColumnSelector,
  setDeleteMode,
  setUpdateMode,
  configTableId,
  entriesToBeDeleted,
  permissions,
  onDelete,
  testId,
  changesMade,
  updateModeOnRows,
}: Props) => {
  const [cmpWidth, setCmpWidth] = useState<number>();
  const [openActionsPanel, setOpenActionsPanel] = useState(false);

  var windowWidth = window.innerWidth;

  const burguerMenu = useRef<any>();

  const changeBurguerMenuValue = (value: boolean, display?: string) => {
    if (burguerMenu.current) {
      burguerMenu.current.checked = value;
      setOpenActionsPanel(value);
      burguerMenu.current.style.display = display ? display : '';
    }
  };

  useEffect(() => {
    const cmpWidth = (document.querySelector('body') as HTMLElement)
      ?.offsetWidth;
    setCmpWidth(cmpWidth);
  }, [windowWidth]);

  if (!!cmpWidth && cmpWidth < 514) {
    return (
      <>
        <div className="grid-actions-panel__toolbar">
          <label
            ref={burguerMenu}
            onClick={(e: React.MouseEvent<HTMLLabelElement>) => {
              const target = e.target as HTMLInputElement;
              setOpenActionsPanel(target?.checked);
            }}
            className="hamburguer-menu grid-actions-panel__burguer-menu"
          >
            <input type="checkbox" />
          </label>
          {deleteMode && (
            <div
              style={{
                gap: '1rem',
                height: '2.65rem',
                display: 'flex',
                alignItems: 'center',
              }}
              className="grid-actions-panel__delete-actions"
            >
              <BsFillTrash2Fill
                onClick={() => {
                  setModelId && setModelId(configTableId);
                  // entriesToBeDeleted &&
                  //   entriesToBeDeleted.length > 0 &&
                  setDeletion && setDeletion(true);
                }}
              />
              <i
                className="fa-solid fa-x "
                onClick={() => {
                  changeBurguerMenuValue(true, 'flex');
                  setDeleteMode && setDeleteMode(false);
                }}
              ></i>
            </div>
          )}
          {updateMode && (
            <div className="grid-actions-panel__update-actions">
              <i
                className="fa-solid fa-x"
                onClick={() => {
                  changeBurguerMenuValue(true, 'flex');
                  setUpdateMode && setUpdateMode(false);
                }}
              ></i>
            </div>
          )}
        </div>

        <div
          className={`grid-actions-panel ${openActionsPanel ? 'active' : ''}`}
        >
          {deleteMode || updateMode || (
            <Button
              className="grid-actions-panel__plus-btn btn"
              data-testid={`${testId}-add-btn`}
              onClick={() => {
                setFlexModelId && setFlexModelId(id);
                setOpenNewEntryView && setOpenNewEntryView(true);
                setModelId &&
                  setModelId((prevState) =>
                    updateModelId
                      ? (prevState = updateModelId)
                      : (prevState = configTableId),
                  );
                add && add();
              }}
            >
              +
            </Button>
          )}
          {updateMode || deleteMode || (
            <Button
              className="grid-actions-panel__restore-btn btn"
              onClick={() => {
                setGridKey && setGridKey((prevState) => prevState + 1);
              }}
            >
              restore
            </Button>
          )}
          {updateMode || deleteMode || (
            <Button
              className="grid-actions-panel__select-btn btn"
              onClick={() => {
                setShowColumnSelector && setShowColumnSelector(true);
              }}
            >
              Select Columns
            </Button>
          )}
          {updateMode || deleteMode || (
            <Button
              name="delete-mode"
              className="grid-actions-panel__delete-btn btn"
              onClick={() => {
                changeBurguerMenuValue(false, 'none');
                setDeleteMode && setDeleteMode(!deleteMode);
              }}
            >
              Delete Mode
            </Button>
          )}
          {updateMode || deleteMode || (
            <Button
              className="grid-actions-panel__update-btn btn"
              onClick={() => {
                changeBurguerMenuValue(false, 'none');
                setUpdateMode && setUpdateMode(!updateMode);
              }}
            >
              Update Mode
            </Button>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="grid-actions-panel">
      {deleteMode ||
        updateMode ||
        (permissions?.createAction && (
          <FaPlusCircle
            data-testid={`${testId}-add-btn`}
            data-cy="grid-add-btn"
            className="grid-actions-panel__plus-btn text-5xl cursor-pointer"
            // style={{
            //   display: 'flex',
            //   alignItems: 'center',
            //   padding: 0,
            //   cursor: 'pointer',
            //   height: '2rem',
            //   fontSize: '4rem',
            //   left: '8rem',
            // }}
            onClick={() => {
              setFlexModelId && setFlexModelId(id);
              setOpenNewEntryView && setOpenNewEntryView(true);
              setModelId &&
                setModelId((prevState) =>
                  updateModelId
                    ? (prevState = updateModelId)
                    : (prevState = configTableId),
                );
              add && add();
            }}
          />
        ))}
      {updateMode || deleteMode || (
        <GrUpdate
          className="grid-actions-panel__restore-btn"
          onClick={() => {
            onRefresh && onRefresh();
          }}
          data-testid={`${testId}-refresh-btn`}
        />
      )}
      {updateMode || deleteMode || (
        <button
          className="grid-actions-panel__select-btn"
          onClick={() => {
            setShowColumnSelector && setShowColumnSelector(true);
          }}
        >
          Select Columns
        </button>
      )}
      {updateMode ||
        deleteMode ||
        (permissions?.deleteAction && (
          <button
            name="delete-mode"
            data-testid={`${testId}-delete-mode`}
            className="grid-actions-panel__delete-btn"
            onClick={() => {
              setDeleteMode && setDeleteMode(true);
            }}
          >
            Delete Mode
          </button>
        ))}
      {updateMode ||
        deleteMode ||
        (permissions?.updateAction &&
          (changesMade ? (
            <div>
              <IoIosSave />
            </div>
          ) : (
            updateModeOnRows || (
              <button
                data-testid={`${testId}-update-mode`}
                className="grid-actions-panel__update-btn"
                onClick={() => {
                  setUpdateMode && setUpdateMode(!updateMode);
                }}
              >
                Update Mode
              </button>
            )
          )))}

      {deleteMode && (
        <div
          style={{
            gap: '1rem',
            height: '2.65rem',
            display: 'flex',
            alignItems: 'center',
          }}
          className="grid-actions-panel__delete-actions"
        >
          <i
            className="fa-solid fa-trash"
            data-testid={`${testId}-delete-btn`}
            data-cy={`grid-delete-btn`}
            aria-label="trash-icon"
            aria-hidden="true"
            onClick={() => {
              if (entriesToBeDeleted && onDelete) {
                onDelete(entriesToBeDeleted);
                setDeleteMode && setDeleteMode(false);
              }
            }}
            style={{ fontSize: '1.8rem', color: '#b53737', cursor: 'pointer' }}
          ></i>
          <i
            className="fa-solid fa-x"
            style={{ fontSize: '1.8rem', cursor: 'pointer' }}
            onClick={() => {
              setDeleteMode && setDeleteMode(false);
            }}
          ></i>
        </div>
      )}
      {updateMode && (
        <div className="grid-actions-panel__update-actions">
          <i
            className="fa-solid fa-x"
            style={{
              fontSize: '1.8rem',
              cursor: 'pointer',
              height: '2.65rem',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => {
              setUpdateMode && setUpdateMode(false);
            }}
          ></i>
        </div>
      )}
    </div>
  );
};
export default GridActionsPanel;
