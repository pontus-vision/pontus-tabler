import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import NewEntryForm from '../components/NewEntryForm';

import Form from 'react-bootstrap/esm/Form';
import Alert from 'react-bootstrap/esm/Alert';
import NewEntryFormSkeleton from '../components/skeleton/NewEntryFormSkeleton';

import { ColumnState } from 'ag-grid-community';

import {
  TableDataRowRef,
  TableRef,
} from '../pontus-api/typescript-fetch-client-generated';

type Props = {
  tableId?: string;
  table: TableRef;
  flexModelId?: string;
  setModelId?: Dispatch<SetStateAction<string | undefined>>;
  aggridColumnsState?: ColumnState[] | undefined;
  setUpdatedGrid?: Dispatch<
    React.SetStateAction<{
      modelId: string;
      key: number;
    }>
  >;
  onSubmit: (data: TableDataRowRef) => void;
  onClose: () => void;
};

const NewEntryView = ({
  tableId,
  table,
  setModelId,
  flexModelId,
  aggridColumnsState,
  setUpdatedGrid,
  onClose,
  onSubmit,
}: Props) => {
  // const [table, setTable] = useState<{
  //   name: string;
  //   fields: TableColumn[];
  // }>();
  const [successMsg, setSuccessMsg] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  // const handleUpdatedGrid = () => {
  //   setUpdatedGrid &&
  //     setUpdatedGrid(
  //       (prevState) =>
  //         (prevState = {
  //           modelId: tableId,
  //           key: prevState ? prevState?.key + 1 : 0,
  //         }),
  //     );
  // };

  useEffect(() => {
    if (!aggridColumnsState) return;
  }, [aggridColumnsState]);

  return (
    <div className="new-entry-view" style={{ position: 'absolute' }}>
      <div
        className="shadow"
        onClick={() => {
          onClose();
        }}
      ></div>

      {table && (
        <Form.Label className="new-entry new-entry-form__title">
          {table?.label}
        </Form.Label>
      )}
      {table && (
        <NewEntryForm
          isLoading={isLoading}
          setIsloading={setIsLoading}
          // handleUpdatedGrid={handleUpdatedGrid}
          table={table}
          onSubmit={onSubmit}
          setSuccessMsg={setSuccessMsg}
        />
      )}
      <Alert
        className={`success-msg ${successMsg ? 'active' : ''}`}
        variant="success"
      >
        {successMsg}
      </Alert>
      <NewEntryFormSkeleton isLoading={isLoading} />
    </div>
  );
};

export default NewEntryView;
