import { ColDef, ColumnApi, ColumnState } from 'ag-grid-community';
import { set } from 'immer/dist/internal';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ColumnSelectorProps {
  columns: Array<ColDef>;
  showColumnSelector?: boolean;
  columnState?: ColumnState[];
  onColumnSelect: (selectedColumns: Array<string | undefined>) => void;
  setShowColumnSelector?: Dispatch<SetStateAction<boolean>>;
}

const PVAggridColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  onColumnSelect,
  showColumnSelector,
  setShowColumnSelector,
  columnState,
}) => {
  const { t } = useTranslation()
  const [selectedColumns, setSelectedColumns] = useState<
    Array<string | undefined>
  >([]);
  const [columnsVisible, setColumnsVisible] = useState<
    Array<ColDef | undefined>
  >([]);

  const handleColumnToggle = (column: string | undefined) => {
    if (selectedColumns.includes(column || '')) {
      setSelectedColumns(selectedColumns.filter((c) => c !== column));
    } else {
      setSelectedColumns((prevState) => [...prevState, column]);
    }
  };

  const handleApply = () => {
    onColumnSelect(selectedColumns);
  };

  const handleCancel = () => {
    setShowColumnSelector && setShowColumnSelector(false);
  };

  useEffect(() => {
    if (columnState) {
      setSelectedColumns(
        columnState.filter((col) => !col.hide).map((el) => el.colId),
      );
    } else {
      const colFields = columns.map((col) => col?.field || '');

      setSelectedColumns(colFields);
    }
  }, [columnsVisible]);

  useEffect(() => {
    if (columnState) {
      setSelectedColumns(
        columnState.filter((col) => !col.hide).map((el) => el.colId),
      );
    } else {
      const colFields = columns.map((col) => col?.field || '');

      setSelectedColumns(colFields);
    }
  }, []);

  useEffect(() => {
    setColumnsVisible((prevState) =>
      columns.filter(
        (col) => col?.colId !== 'delete-mode' && col?.colId !== 'update-mode',
      ),
    );

    // console.log({ columnsVisible, columns, columnState });
  }, [columns]);


  return (
    <div
      style={{
        borderRadius: '4px',
        boxShadow: '0px 0px 5px black',
        padding: '1rem',
        backgroundColor: 'white',
        zIndex: 3,
        position: 'absolute',
        top: 0,
        left: '5rem',
        display: showColumnSelector ? '' : 'none',
      }}
    >
      <div>
        {columnsVisible.map((column, index) => {
          if (!column) return;
          return (
            <div key={index}>
              <label style={{ fontSize: '1rem' }}>
                <input
                  type="checkbox"
                  checked={selectedColumns.some((el) => column.field === el)}
                  onChange={(e) => handleColumnToggle(column.field)}
                />
                <span></span> {column.headerName}
              </label>
            </div>
          );
        })}
      </div>
      <div>
        <button onClick={handleApply}>{t('Apply')}</button>
        <button onClick={handleCancel}>{t('Cancel')}</button>
      </div>
    </div>
  );
};

export default PVAggridColumnSelector;
