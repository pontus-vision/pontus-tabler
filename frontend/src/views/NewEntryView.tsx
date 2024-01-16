import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewEntryForm from '../components/NewEntryForm';
import { ICmsGetContentModelData } from '../types';
import styled from 'styled-components';
import Form from 'react-bootstrap/esm/Form';
import Alert from 'react-bootstrap/esm/Alert';
import NewEntryFormSkeleton from '../components/skeleton/NewEntryFormSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ColumnState } from 'ag-grid-community';
import { selectCount } from '../store/slice';
import { newRowState, selectRowState } from '../store/sliceGridUpdate';
import { cmsGetContentModel } from '../webinyApi';
import { getModelFields, tableRead } from '../client';
import { TableColumn } from '../pontus-api/typescript-fetch-client-generated';

type Props = {
  modelId: string;
  flexModelId?: string;
  setModelId: Dispatch<SetStateAction<string | undefined>>;
  aggridColumnsState: ColumnState[] | undefined;
  setUpdatedGrid: Dispatch<
    React.SetStateAction<{
      modelId: string;
      key: number;
    }>
  >;
  setOpenNewEntryView: Dispatch<React.SetStateAction<boolean>>;
};

const NewEntryView = ({
  modelId,
  setModelId,
  flexModelId,
  aggridColumnsState,
  setUpdatedGrid,
  setOpenNewEntryView,
}: Props) => {
  const [contentModel, setContentModel] = useState<{
    name: string;
    fields: TableColumn[];
  }>();
  const [successMsg, setSuccessMsg] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const {
    rowState,
    tableId: updateModelId,
    rowId,
  } = useSelector((state: RootState) => state.updateRow);
  const dispatch = useDispatch();

  const [fieldsRendered, setFieldsRendered] = useState(false);

  const getModelContent = async (modelId: string) => {
    try {
      setIsLoading(true);
      const data = await tableRead(modelId);
      console.log({ data });

      if (!data?.data.cols) return;

      setIsLoading(false);

      // const filteredFields = data?.fields.filter(
      //   (field) =>
      //     !aggridColumnsState?.some(
      //       (col) =>
      //         !field?.validation?.some((valid) => valid.name === 'required') &&
      //         col.colId === field.fieldId &&
      //         col.hide,
      //     ),
      // );

      const newContentModel: { name: string; fields: TableColumn[] } = {
        name: modelId,
        fields: data.data.cols,
      };
      setContentModel(newContentModel);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatedGrid = () => {
    setUpdatedGrid(
      (prevState) =>
        (prevState = { modelId, key: prevState ? prevState?.key + 1 : 0 }),
    );
  };

  useEffect(() => {
    if (!aggridColumnsState) return;
  }, [aggridColumnsState]);

  useEffect(() => {
    if (modelId) {
      getModelContent(modelId);
    }
  }, [modelId]);

  return (
    <div className="new-entry-view">
      {modelId && (
        <div
          className="shadow"
          onClick={() => {
            setOpenNewEntryView(false);
            dispatch(
              newRowState({
                tableId: undefined,
                rowId: undefined,
                rowState: undefined,
              }),
            );
          }}
        ></div>
      )}
      {contentModel && (
        <Form.Label className="new-entry new-entry-form__title">
          {contentModel?.name}
        </Form.Label>
      )}

      {contentModel && (
        <NewEntryForm
          isLoading={isLoading}
          setIsloading={setIsLoading}
          handleUpdatedGrid={handleUpdatedGrid}
          contentModel={contentModel}
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
