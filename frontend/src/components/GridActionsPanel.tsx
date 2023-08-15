import { Dispatch, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { BsFillTrash2Fill } from 'react-icons/bs';

type Props = {
  deleteMode: boolean;
  updateMode: boolean;
  setGridKey: Dispatch<React.SetStateAction<number>>;
  setFlexModelId: Dispatch<React.SetStateAction<string | undefined>>;
  setOpenNewEntryView: React.Dispatch<React.SetStateAction<boolean>>;
  setModelId: React.Dispatch<React.SetStateAction<string | undefined>>;
  updateModelId: string | undefined;
  setDeletion: Dispatch<React.SetStateAction<boolean>>;
  id: string;
  setShowColumnSelector: Dispatch<React.SetStateAction<boolean>>;
  setDeleteMode: Dispatch<React.SetStateAction<boolean>>;
  setUpdateMode: Dispatch<React.SetStateAction<boolean>>;
  configTableId: string;
  entriesToBeDeleted: string[] | undefined;
};

const GridActionsPanel = ({
  deleteMode,
  updateMode,
  setGridKey,
  setFlexModelId,
  setOpenNewEntryView,
  setModelId,
  updateModelId,
  setDeletion,
  id,
  setShowColumnSelector,
  setDeleteMode,
  setUpdateMode,
  configTableId,
  entriesToBeDeleted,
}: Props) => {
  const [cmpWidth, setCmpWidth] = useState<number>();
  const [openActionsPanel, setOpenActionsPanel] = useState(false);

  var windowWidth = window.innerWidth;

  const burguerMenu = useRef(null);

  const changeBurguerMenuValue = (value: boolean, display?: string) => {
    burguerMenu.current.checked = value;
    setOpenActionsPanel(value);
    burguerMenu.current.style.display = display ? display : '';
  };

  useEffect(() => {
    const cmpWidth = document.querySelector('.grid-actions-panel')?.offsetWidth;
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
                  setModelId(configTableId);
                  console.log('whatever');
                  entriesToBeDeleted &&
                    entriesToBeDeleted.length > 0 &&
                    setDeletion(true);
                }}
              />
              <i
                className="fa-solid fa-x"
                onClick={() => {
                  changeBurguerMenuValue(true, 'flex');
                  setDeleteMode(false);
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
                  setUpdateMode(false);
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
              onClick={() => {
                setFlexModelId(id);
                console.log('add entry');
                setOpenNewEntryView(true);
                setModelId((prevState) =>
                  updateModelId
                    ? (prevState = updateModelId)
                    : (prevState = configTableId),
                );
              }}
            >
              +
            </Button>
          )}
          {updateMode || deleteMode || (
            <Button
              className="grid-actions-panel__restore-btn btn"
              onClick={() => {
                setGridKey((prevState) => prevState + 1);
                console.log('restore');
              }}
            >
              restore
            </Button>
          )}
          {updateMode || deleteMode || (
            <Button
              className="grid-actions-panel__select-btn btn"
              onClick={() => {
                setShowColumnSelector(true);
              }}
            >
              Select Columns
            </Button>
          )}
          {updateMode || deleteMode || (
            <Button
              className="grid-actions-panel__delete-btn btn"
              onClick={() => {
                changeBurguerMenuValue(false, 'none');
                setDeleteMode(!deleteMode);
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
                setUpdateMode(!updateMode);
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
      {deleteMode || updateMode || (
        <label
          className="grid-actions-panel__plus-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            cursor: 'pointer',
            height: '2rem',
            fontSize: '4rem',
            left: '8rem',
          }}
          onClick={() => {
            setFlexModelId(id);
            setOpenNewEntryView(true);
            setModelId((prevState) =>
              updateModelId
                ? (prevState = updateModelId)
                : (prevState = configTableId),
            );
          }}
        >
          +
        </label>
      )}
      {updateMode || deleteMode || (
        <button
          className="grid-actions-panel__restore-btn"
          onClick={() => {
            setGridKey((prevState) => prevState + 1);
          }}
        >
          restore
        </button>
      )}
      {updateMode || deleteMode || (
        <button
          className="grid-actions-panel__select-btn"
          onClick={() => {
            setShowColumnSelector(true);
          }}
        >
          Select Columns
        </button>
      )}
      {updateMode || deleteMode || (
        <button
          className="grid-actions-panel__delete-btn"
          onClick={() => {
            setDeleteMode(!deleteMode);
          }}
        >
          Delete Mode
        </button>
      )}
      {updateMode || deleteMode || (
        <button
          className="grid-actions-panel__update-btn"
          onClick={() => {
            setUpdateMode(!updateMode);
          }}
        >
          Update Mode
        </button>
      )}

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
            onClick={() => {
              setModelId(configTableId);
              entriesToBeDeleted &&
                entriesToBeDeleted.length > 0 &&
                setDeletion(true);
            }}
            style={{ fontSize: '1.8rem', color: '#b53737', cursor: 'pointer' }}
          ></i>
          <i
            className="fa-solid fa-x"
            style={{ fontSize: '1.8rem', cursor: 'pointer' }}
            onClick={() => {
              setDeleteMode(false);
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
              setUpdateMode(false);
            }}
          ></i>
        </div>
      )}
    </div>
  );
};
export default GridActionsPanel;
