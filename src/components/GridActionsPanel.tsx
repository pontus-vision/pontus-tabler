import { Dispatch, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';

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
  configModelId: string;
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
  configModelId,
  entriesToBeDeleted,
}: Props) => {
  const [cmpWidth, setCmpWidth] = useState<number>();
  const [openActionsPanel, setOpenActionsPanel] = useState(false);

  var windowWidth = window.innerWidth;

  const burguerMenu = useRef(null);

  const changeBurguerMenuValue = (value: boolean, visibility?: string) => {
    burguerMenu.current.checked = value;

    burguerMenu.current.style.visibility = visibility ? visibility : '';
  };

  useEffect(() => {
    const cmpWidth = document.querySelector('.grid-actions-panel')?.offsetWidth;
    setCmpWidth(cmpWidth);
  }, [windowWidth]);

  const tabActionsPanel = (
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
                : (prevState = configModelId),
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
            changeBurguerMenuValue(false, 'hidden');
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
            changeBurguerMenuValue(false, 'hidden');
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
              setModelId(configModelId);
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

  if (!!cmpWidth && cmpWidth < 514) {
    return (
      <>
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
        <div className="grid-actions-panel__toolbar">
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
                  changeBurguerMenuValue(true, 'visible');
                  setModelId(configModelId);
                  entriesToBeDeleted &&
                    entriesToBeDeleted.length > 0 &&
                    setDeletion(true);
                }}
                style={{
                  fontSize: '1.8rem',
                  color: '#b53737',
                  cursor: 'pointer',
                }}
              ></i>
              <i
                className="fa-solid fa-x"
                style={{ fontSize: '1.8rem', cursor: 'pointer' }}
                onClick={() => {
                  changeBurguerMenuValue(true, 'visible');
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
                  changeBurguerMenuValue(true, 'visible');
                  setUpdateMode(false);
                }}
              ></i>
            </div>
          )}
        </div>

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
                    : (prevState = configModelId),
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
                changeBurguerMenuValue(false, 'hidden');
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
                changeBurguerMenuValue(false, 'hidden');
                setUpdateMode(!updateMode);
              }}
            >
              Update Mode
            </button>
          )}
        </div>
      </>
    );
  }

  return tabActionsPanel;
};
export default GridActionsPanel;
