import { Dispatch, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteDataTableRow, deleteEntry } from '../client';

type Props = {
  entries: string[];
  modelId: string;
  updateGridKey: Dispatch<
    React.SetStateAction<{
      modelId: string;
      key: number;
    }>
  >;
  setDeletion: Dispatch<React.SetStateAction<boolean>>;
};

const DeleteEntriesModal = ({
  entries,
  modelId,
  updateGridKey,
  setDeletion,
}: Props) => {
  const { t } = useTranslation();

  const deleteEntries = () => {
    if (!entries || !modelId) return;

    entries.forEach(async (entry) => {
      const { data } = await deleteDataTableRow(modelId, entry);

      updateGridKey((prevState) => ({
        key: prevState?.key + 1,
        modelId,
      }));
    });
  };

  return (
    <>
      <div
        className="shadow"
        style={{
          position: 'fixed',
          background: '#0000001f',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
        }}
      ></div>
      <div className="delete-modal" onClick={() => deleteEntries()}>
        <label htmlFor="delete-button">
          {entries.length > 1
            ? t('confirm-delete-entries')
            : t('confirm-delete-entry')}
        </label>
        <div
          style={{ display: 'flex', gap: '1rem' }}
          className="delete-modal_btns"
        >
          <button id="delete-button" onClick={() => deleteEntries()}>
            {t('yes')}
          </button>
          <button id="cancel-delete-button" onClick={() => setDeletion(false)}>
            {t('Cancel')}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteEntriesModal;
