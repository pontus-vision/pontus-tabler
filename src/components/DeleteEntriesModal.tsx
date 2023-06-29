import { Dispatch } from 'react';
import { cmsDeleteEntry } from '../webinyApi';
import { useTranslation } from 'react-i18next';

type Props = {
  entries: string[];
  modelId: string;
  setGridKey: Dispatch<React.SetStateAction<number>>;
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
  setGridKey,
  updateGridKey,
  setDeletion,
}: Props) => {
  const { t } = useTranslation();

  const deleteEntries = () => {
    if (!entries || !modelId) return;

    entries.forEach(async (entry) => {
      const { data } = await cmsDeleteEntry(modelId, entry);
      console.log(data);
      updateGridKey((prevState) => ({
        key: prevState?.key + 1,
        modelId: modelId,
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
      <div
        className="delete-modal"
        onClick={() => deleteEntries()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          transform: 'translate(-50%,-50%)',
          position: 'absolute',
          background: 'red',
          zIndex: 10,
          width: '50%',
          height: '30%',
          top: '50%',
          left: '50%',
        }}
      >
        <label htmlFor="delete-button">{t('confirm-delete-entries')}</label>
        <div
          style={{ display: 'flex', gap: '1rem' }}
          className="delete-modal_btns"
        >
          <button id="delete-button" onClick={() => deleteEntries}>
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
