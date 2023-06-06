import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import {
  ICmsGetContentModelData,
  ICmsGetContentModelDataField,
  WebinyRefInput,
} from "../types";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { cmsEntriesCreateModel, cmsGetContentModel, listModel } from "../client";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { useTranslation } from "react-i18next";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateCPF } from "../SchemasValidation";


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
  const [formInputs, setFormInputs] = useState<{[key: string]: unknown;}>({});
  const { t } = useTranslation();
  


  const validationTypes = ["cpf", "email"];

  

  useEffect(()=>{
    console.log({contentModel})
  },[contentModel])

  const createValidationSchema = (rules) => {
    let schema = z.string();

    if (rules.includes("required")) {
      schema = schema.nonempty({ message: "Field is required" });
    }

    if (rules.includes("cpf")) {
      schema = schema.refine(
        (value) => {
          validateCPF(value)
        },
        { message: "CPF inválido" }
      );
    }

    return schema;
  };

  const renderField = (field: ICmsGetContentModelDataField) => {
    const validationRules = field.validation?.map(valid=> valid.settings?.preset)
    
    const validationSchema = validationRules && createValidationSchema(validationRules);
    

    const { handleSubmit, register, formState: {errors} } = useForm({
      resolver: zodResolver(validationSchema),
    });

    if (field.type === "text") {
      if (field.renderer.name === "checkboxes") {
        const arr = []

        return field.predefinedValues?.values.map((value) => (
          <>
          <Form.Check
            key={field.fieldId}
            type="checkbox"
            id={value.value}
            label={value.label}
            onChange={(e) =>{
                arr.push(value.value)

              if(Array.isArray(formInputs[field.fieldId])) {
                setFormInputs(prevState=> ({...prevState, [field.fieldId]: [...prevState[field.fieldId], value.value]}))
              }  else{
                setFormInputs(prevState=> ({...prevState, [field.fieldId]: arr}))
              }
            }
            
          }
          >
            {/* <Form.Check.Input  /> */}
          </Form.Check>
          </>
        ));
      }else if(field.renderer.name === "select-box") {
        return (
        <>
        <Form.Label key={field.fieldId}>{field.label}</Form.Label>
        <Form.Select key={field.fieldId} onChange={(e)=>setFormInputs(prevState=>({...prevState,[field.fieldId]:e.target.value}))}>
          {field.predefinedValues?.values.map(el=> <option value={el.value}>{el.label}</option>)}
        </Form.Select>
        </>
        )
      }
      return (
        <>
          <Form.Label key={field.fieldId}>{field.label}</Form.Label>
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
    

      const [options, setOptions] = useState<any>();
        const [headers, setHeaders] = useState<string[]>()

        useEffect(() => {
          const fetchData = async () => {
            if (!refs || refs.length === 0) return
            const res = await getModelFieldsContent(refs[0].modelId, 5, null);
            
            
            
            if(!res) return
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
            }
          }, [refs]);
        
        if (!refs || !headers || !options) return;
        if (field.renderer.name === "ref-input") {

        return (
          <>
            <Form.Label key={field.fieldId}>{field.label}</Form.Label>
            <Typeahead
            key={field.fieldId}
            onChange={(e:any)=>{
              const ref:WebinyRefInput = {
                modelId: refs[0].modelId,
                id: e[0]?.id 
              }
              console.log(ref);
              (setFormInputs((prevState)=> ({...prevState, [`${field.fieldId}`]: ref})))
            }}
              id={field.fieldId}
              labelKey={(option: any)=> headers?.map((el:any)=> option[el]).join(" ")}
              
              options={options}
            />
          </>
        );
      }else if(field.renderer.name === "ref-inputs") {
        return <>
        <Form.Label key={field.fieldId}>{field.label}</Form.Label>
        <Typeahead
        key={field.fieldId}
          id={field.fieldId}
          onChange={e=>{
            const refInputs:WebinyRefInput[] = e.map((el)=>{
              const ref = {
                modelId: refs[0].modelId,
                id: el.id
              }
              return ref
            })
            e.length !== 0 && setFormInputs(prevState=> ({...prevState, [`${field.fieldId}`]:refInputs}))
          
          }}
          labelKey={(option)=> headers.map(el=> option[el]).join(" ")}
          multiple
          options={options}
        />
      </>
      }
    } else if (field.type === "long-text") {
      if(field.renderer.name === "long-text-text-area") {
        return (
        <>
          <Form.Label key={field.fieldId}>{field.label}</Form.Label>
          <FloatingLabel key={field.fieldId} controlId="floatingTextarea2" label={field.helpText}>
            <Form.Control key={field.fieldId} onChange={(e)=> setFormInputs(prevState => ({...prevState, [`${field.fieldId}`]: e.target.value}))}
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
  const onSubmit = async(dataInput: { [key: string]: unknown;}) => {
    
    const func = (field: any) => {
      if(field.type === "text") {
        return `${field.fieldId}`
      }
      else if(field.type === "ref") {
        return `${field.fieldId} {
          modelId
          id
          __typename
        }`
      }else if (field.type === "object" && field?.settings) {
        return `${field.fieldId} {
          ${field.settings.fields?.map(field=> func(field)).join("\n")}
        }`
      }
    }
    try {
      const data = await cmsEntriesCreateModel(contentModel.modelId, dataInput, contentModel.fields.map(field=>
        func(field)
        ).join("\n"))
      console.log({data})

      
    } catch (error) {
      console.error(error)
    }
    

  };

  useEffect(()=>{

    console.log({formInputs})
  },[formInputs])

  return (
    <Form className="new-entry__form" onSubmit={(e)=>{
      e.preventDefault()
      onSubmit(formInputs)}}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        {contentModel.fields.map((field) => {
          console.log({field})
          return renderField(field);
        })}
      </Form.Group>
      <button>{t("submit-form")}</button>
    </Form>
  );
};

export default NewEntryForm;
