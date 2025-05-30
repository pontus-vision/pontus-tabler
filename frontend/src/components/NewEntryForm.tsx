import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import Form from 'react-bootstrap/Form';
import { WebinyRefInput } from '../types';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { getModelData } from '../client';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  TableDataRowRef,
  TableRef,
} from '../pontus-api/typescript-fetch-client-generated';

type Props = {
  setIsloading: Dispatch<SetStateAction<boolean>>;
  table: TableRef;
  isLoading: boolean;
  onSubmit: (data: TableDataRowRef) => void;
  handleUpdatedGrid?: () => void;
  setSuccessMsg: Dispatch<SetStateAction<string | undefined>>;
  rowState: Record<string, any>[];
};

const NewEntryForm = ({
  table,
  setIsloading,
  onSubmit,
  isLoading,
  rowState,
}: Props) => {
  const [formInputs, setFormInputs] = useState<{ [key: string]: any }>({});
  const [formObjField, setFormObjField] = useState<{ [key: string]: unknown }>(
    {},
  );

  //  const {
  //    tableId: updateTableId,
  //    rowId,
  //    rowState,
  //  } = useSelector((state: RootState) => state.updateRow);

  const { t } = useTranslation();

  const renderField = (
    field: TableColumn,
    index: number,
    objFieldId: string | null = null,
  ): ReactElement<any, any> | undefined => {
    // const validationRules = field.validation?.map(valid=> valid.settings?.preset)

    // const validationSchema = validationRules && createValidationSchema(validationRules);

    // const { handleSubmit, register, formState: {errors} } = useForm({
    //   resolver: zodResolver(validationSchema),
    // });
    return (
      <div className="field form__text-input">
        <Form.Label>{field.headerName}</Form.Label>
        <Form.Control
          data-cy={`new-entry-form-${index}-text-input`}
          defaultValue={{ ...formInputs, ...rowState }[field?.name || '']}
          onChange={(e) => {
            if (objFieldId) {
              setFormInputs((prevState: { [key: string]: unknown }) => ({
                ...prevState,
                [`${objFieldId}`]: {
                  ...prevState[objFieldId],
                  [field.fieldId]: e.target.value,
                },
              }));
            } else {
              setFormInputs((prevState) => ({
                ...prevState,
                [`${field.field}`]: e.target.value,
              }));
            }
          }}
        ></Form.Control>
      </div>
    );

    if (field?.type === 'text') {
      if (field.renderer.name === 'checkboxes') {
        const arr = [] as string[];
        return (
          <div className="field form__checkboxes">
            <Form.Label>{field.label}</Form.Label>
            {field.predefinedValues?.values.map((value, index) => (
              <Form.Check
                defaultValue={
                  objFieldId && rowState?.[objFieldId]
                    ? rowState?.[objFieldId]?.[field.fieldId]
                    : rowState
                      ? rowState?.[field.fieldId]
                      : undefined
                }
                key={index}
                type="checkbox"
                id={value.value}
                label={value.label}
                onChange={(e) => {
                  if (objFieldId) {
                    if (Array.isArray(formInputs[objFieldId][field.fieldId])) {
                      // setFormInputs((prevState) => ({ ...prevState, [`${objFieldId}`]: {...prevState[objFieldId], [field.fieldId]: value.value }}))
                      console.log({ objFieldId });
                      setFormInputs(
                        (prevState: { [key: string]: unknown | any }) => ({
                          ...prevState,
                          [objFieldId]: {
                            ...prevState[objFieldId],
                            [field.fieldId]: [
                              ...prevState[objFieldId][field.fieldId],
                              value.value,
                            ],
                          },
                        }),
                      );
                    } else {
                      arr.push(value.value);
                      setFormInputs((prevState) => ({
                        ...prevState,
                        [objFieldId]: {
                          ...prevState[objFieldId],
                          [field.fieldId]: arr,
                        },
                      }));
                    }
                  } else {
                    if (Array.isArray(formInputs[field.fieldId])) {
                      setFormInputs(
                        (prevState: { [key: string]: unknown | any }) => ({
                          ...prevState,
                          [field.fieldId]: [
                            ...prevState[field.fieldId],
                            value.value,
                          ],
                        }),
                      );
                    } else {
                      arr.push(value.value);
                      setFormInputs((prevState) => ({
                        ...prevState,
                        [field.fieldId]: arr,
                      }));
                    }
                  }
                }}
              ></Form.Check>
            ))}
          </div>
        );
      } else if (field.renderer.name === 'select-box') {
        return (
          <div className="field form__select-box">
            <Form.Label>{field.label}</Form.Label>
            <Form.Select
              defaultValue={
                objFieldId && rowState && rowState?.[objFieldId]
                  ? rowState?.[objFieldId]?.[field.fieldId]
                  : rowState
                    ? rowState?.[field.fieldId]
                    : undefined
              }
              onChange={(e) => {
                if (objFieldId) {
                  setFormInputs(
                    (prevState: {
                      [key: string]: { [key: string]: unknown };
                    }) => ({
                      ...prevState,
                      [`${objFieldId}`]: {
                        ...prevState[objFieldId],
                        [field.fieldId]: e.target.value,
                      },
                    }),
                  );
                } else {
                  setFormInputs((prevState) => ({
                    ...prevState,
                    [`${field.fieldId}`]: e.target.value,
                  }));
                }
              }}
            >
              {field.predefinedValues?.values.map((el) => (
                <option value={el.value}>{el.label}</option>
              ))}
            </Form.Select>
          </div>
        );
      } else if (field.renderer.name === 'text-input') {
        const defaultValue = rowState?.[objFieldId]?.[field.fieldId]
          ? rowState?.[objFieldId]?.[field.fieldId]
          : rowState?.[field.fieldId]
            ? rowState?.[field.fieldId]
            : undefined;
        return (
          <div className="field form__text-input">
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              defaultValue={defaultValue}
              onChange={(e) => {
                if (objFieldId) {
                  setFormInputs((prevState: { [key: string]: unknown }) => ({
                    ...prevState,
                    [`${objFieldId}`]: {
                      ...prevState[objFieldId],
                      [field.fieldId]: e.target.value,
                    },
                  }));
                } else {
                  setFormInputs((prevState) => ({
                    ...prevState,
                    [`${field.fieldId}`]: e.target.value,
                  }));
                }
              }}
            ></Form.Control>
          </div>
        );
      }
    } else if (field?.type === 'ref') {
      const refs = field?.settings?.models;

      const [options, setOptions] = useState<any>();
      const [headers, setHeaders] = useState<string[]>();

      useEffect(() => {
        const fetchData = async () => {
          if (!refs || refs.length === 0) return;
          const res = await getModelData(refs[0].modelId, 5, null);

          if (!res) return;
          setOptions(
            res.modelContentListData.map((el, value) => {
              const {
                createdBy,
                createdOn,
                entryId,
                ownedBy,
                savedOn,
                ...rest
              } = el;
              return rest;
            }),
          );

          setHeaders(res.columnNames.map((el) => el.fieldId));
        };

        if (refs && refs.length > 0) {
          fetchData();
        }
      }, [refs]);

      if (!refs || !headers || !options) return;
      if (field.renderer.name === 'ref-input') {
        return (
          <div className="field form__ref-input">
            <Form.Label>{field.label}</Form.Label>
            <Typeahead
              defaultValue={
                objFieldId && rowState?.[objFieldId]
                  ? rowState?.[objFieldId]?.[field.fieldId]
                  : rowState
                    ? ''
                    : undefined
              }
              onChange={(e: any) => {
                const ref: WebinyRefInput = {
                  modelId: refs[0].modelId,
                  id: e[0]?.id,
                };
                if (objFieldId) {
                  setFormObjField((prevState) => ({
                    ...prevState,
                    [`${field.fieldId}`]: ref,
                  }));
                } else {
                  setFormInputs((prevState) => ({
                    ...prevState,
                    [`${field.fieldId}`]: ref,
                  }));
                }
              }}
              id={field.fieldId}
              labelKey={(option: any) =>
                headers?.map((el: any) => option[el]).join(' ')
              }
              options={options}
            />
          </div>
        );
      } else if (field.renderer.name === 'ref-inputs') {
        return (
          <div className="field form__ref-inputs">
            <Form.Label>{field.label}</Form.Label>
            <Typeahead
              placeholder={t('select-inputs') as string}
              id={field.fieldId}
              onChange={(e) => {
                const refInputs = e.map((el: any) => {
                  const ref = {
                    modelId: refs[0].modelId,
                    id: el.id,
                  };
                  return ref;
                });
                if (e.length === 0) return;
                if (objFieldId) {
                  setFormObjField((prevState) => ({
                    ...prevState,
                    [`${field.fieldId}`]: refInputs,
                  }));
                } else {
                  setFormInputs((prevState) => ({
                    ...prevState,
                    [`${field.fieldId}`]: refInputs,
                  }));
                }
              }}
              labelKey={(option: any) =>
                headers.map((el) => option[el]).join(' ')
              }
              multiple
              options={options}
            />
          </div>
        );
      }
    } else if (field?.type === 'long-text') {
      if (field.renderer.name === 'long-text-text-area') {
        return (
          <div className="field form__long-text">
            <Form.Label>{field.label}</Form.Label>
            <FloatingLabel controlId="floatingTextarea2" label={field.helpText}>
              <Form.Control
                defaultValue={
                  objFieldId && rowState?.[objFieldId]
                    ? rowState?.[objFieldId]?.[field.fieldId]
                    : rowState
                      ? rowState?.[field.fieldId]
                      : undefined
                }
                onChange={(e) => {
                  if (objFieldId) {
                    setFormInputs((prevState) => ({
                      ...prevState,
                      [`${field.fieldId}`]: e.target.value,
                    }));
                    // setFormInputs(prevState => ({...prevState, [`${objFieldId}`]: prevState[`${objFieldId}`], [`${field.fieldId}`]: e.target.value}))
                  } else {
                    setFormInputs((prevState) => ({
                      ...prevState,
                      [`${field.fieldId}`]: e.target.value,
                    }));
                  }
                }}
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: '100px' }}
              />
            </FloatingLabel>
          </div>
        );
      }
    } else if (field?.type === 'object' && field?.settings) {
      const objFieldId = field.fieldId;
      // setFormObjFieldName(objFieldId)
      return (
        <div className="field form__object">
          <Form.Label>{field.label}</Form.Label>
          {field.settings.fields?.map((field) =>
            renderField(field, objFieldId),
          )}
        </div>
      );
    }
  };


  const fields = () => {
    let num = 0;
    if (num === table?.cols?.length + 1) {
      setIsloading(false);
    }
    return table?.cols?.map((field, index, arr) => {
      return renderField(field, index);
    });
  };

  return (
    <>
      <div
        className="new-entry-form"
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <Form
          className="new-entry "
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formInputs);
          }}
        >
          <Form.Group className="new-entry-form__group mb-3">
            {table?.cols?.map((field, index, arr) => {
              return renderField(field, index);
            })}
          </Form.Group>
          <button data-cy={`new-entry-form-submit-btn`}>
            {t('submit-form')}
          </button>
        </Form>
      </div>
    </>
  );
};

export default NewEntryForm;
