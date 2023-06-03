import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import {
  ICmsGetContentModelData,
  ICmsGetContentModelDataField,
  IListModelResponseData,
  WebinyModel,
  WebinyRefInput,
} from "../types";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { cmsGetContentModel, listModel } from "../client";
import { ModelColName } from "../types";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";

type Props = {
  contentModel: ICmsGetContentModelData;
};

const getModelFieldsContent = async (
  modelId: string,
  limit: number,
  after: string | null,
  fieldsSearches = null
) => {
  const cmsContentModel = await cmsGetContentModel(modelId);

  const { fields: columnNames } = cmsContentModel.data;
  const data = await listModel(
    modelId,
    columnNames,
    limit,
    after,
    fieldsSearches
  );

  // console.log({ columnNames });
    if (!!data) {
      const {data: modelContentListData, meta} = data
      return { columnNames, modelContentListData, meta };
    }
};

const NewEntryForm = ({ contentModel }: Props) => {
  const [formInputs, setFormInputs] = useState<any>({});

  const renderField = (field: ICmsGetContentModelDataField) => {
    if (field.type === "text") {
      if (field.renderer.name === "checkboxes") {
        return field.predefinedValues?.values.map((value) => (
          <Form.Check
            type="checkbox"
            id={value.value}
            label={value.label}
            onChange={(e) =>
              setFormInputs((prevState: any) => ({
                ...prevState,
                [`${field.fieldId}`]: {
                  ...prevState[`${field.fieldId}`],
                  [`${value.label}`]: value.value,
                },
              }))
            }
          >
            {/* <Form.Check.Input  /> */}
          </Form.Check>
        ));
      }else if(field.renderer.name === "select-box") {
        return (
        <>
        <Form.Label>{field.label}</Form.Label>
        <Form.Select>
          {field.predefinedValues?.values.map(el=> <option value={el.value}>{el.label}</option>)}
        </Form.Select>
        </>
        )
      }
      return (
        <>
          <Form.Label>{field.label}</Form.Label>
          <Form.Control
            key={field.fieldId}
            onChange={(e) =>
              setFormInputs((prevState) => ({
                ...prevState,
                [`${field.fieldId}`]: e.target.value,
              }))
            }
          ></Form.Control>
        </>
      );
    } else if (field.type === "ref") {
      const refs = field?.settings?.models;
      const [options, setOptions] = useState<{ [key: string]: unknown; id: string; }[]>();
        const [headers, setHeaders] = useState<string[]>()

        useEffect(() => {
          const fetchData = async () => {
            const res = await getModelFieldsContent(refs[0].modelId, 5, null);
            if(res) {
            
            setOptions(
              res.modelContentListData.map((el) => {
                const {
                  createdBy,
                  createdOn,
                  entryId,
                  ownedBy,
                  savedOn,
                  ...rest
                } = el;
                return rest;
              })
              );
              
              setHeaders(res.columnNames.map(el=>el.fieldId))
            };
            
            if (refs && refs.length > 0) {
              fetchData();
            }}
          }, [refs]);
          
          if(options) {
            console.log()
        }

        useEffect(()=>{
          console.log(options)
        },[options])
        
        if (!refs || !headers || !options) return;
        if (field.renderer.name === "ref-input") {

        return (
          <>
            <Form.Label>{field.label}</Form.Label>
            <Typeahead
            onChange={e=>{
              const ref:WebinyRefInput = {
                modelId: refs[0].modelId,
                id: e[0].id
              }
              console.log(ref);
              (setFormInputs(prevState=> ({...prevState, [`${field.fieldId}`]: ref})))
            }}
              id={field.fieldId}
              labelKey={(option: any)=> headers?.map((el:any)=> option[el]).join(" ")}
              
              options={options}
            />
          </>
        );
      }else if(field.renderer.name === "ref-inputs") {
        return <>
        <Form.Label>{field.label}</Form.Label>
        <Typeahead
          id={field.fieldId}
          onChange={e=>{
            const ref:WebinyRefInput[] = e.map(el=>{
              const ref = {
                modelId: refs[0].modelId,
                id: el.id
            }
            return ref
            })
            console.log({ref,e});
            e.length !== 0 && setFormInputs(prevState=> ({...prevState, [`${field.fieldId}`]:ref}))
          
          }}
          labelKey={option=> headers.map(el=> option[el]).join(" ")}
          multiple
          options={options}
        />
      </>
      }
    } else if (field.type === "long-text") {
      if(field.renderer.name === "long-text-text-area") {
        return (
        <>
          <Form.Label>{field.label}</Form.Label>
          <FloatingLabel controlId="floatingTextarea2" label={field.helpText}>
            <Form.Control onChange={(e)=> setFormInputs(prevState => ({...prevState, [`${field.fieldId}`]: e.target.value}))}
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: '100px' }}
              />
          </FloatingLabel>
        </>
      )
      }
    }
  };

  useEffect(()=>{
    console.log({formInputs})
  },[formInputs])

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        {contentModel.fields.map((field) => {
          return renderField(field);
        })}
      </Form.Group>
    </Form>
  );
};

export default NewEntryForm;
