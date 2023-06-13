import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import {
  ICmsGetContentModelData,
  ICmsGetContentModelDataField,
  UnknownKey,
  WebinyRefInput,
} from "../types";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { cmsPublishModelId, cmsEntriesCreateModel, cmsGetContentModel, listModel, cmsCreateModelFrom } from "../client";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { useTranslation } from "react-i18next";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateCPF } from "../SchemasValidation";
import styled from "styled-components";
import Alert from 'react-bootstrap/Alert';
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import NewEntryFormSkeleton from "./skeleton/NewEntryFormSkeleton";


type Props = {
  setIsloading: Dispatch<SetStateAction<boolean>>
  contentModel: ICmsGetContentModelData;
  updateModelId: string;
  isLoading: boolean
  handleUpdatedGrid : () => void;
  setSuccessMsg: Dispatch<SetStateAction<string | undefined>>
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

const NewEntryForm = ({ contentModel, setSuccessMsg, handleUpdatedGrid, updateModelId, setIsloading, isLoading }: Props) => {
  const [formInputs, setFormInputs] = useState<{[key: string]: unknown;}>({});
  const [formObjField, setFormObjField] = useState<{[key: string]: unknown;}>({});
  const [formObjFieldName, setFormObjFieldName] = useState<string>();


  
  const { rowState, rowId, modelId:updateRowModelId } = useSelector((state: RootState) => state.updateRow);
  
  
  const { t } = useTranslation();

  useEffect(()=>{console.log({formInputs})},[formInputs])
  
  
  useEffect(()=>{
    console.log({contentModel})
  },[contentModel])

  const createValidationSchema = (rules: string []) => {
    let schema = z.string() 

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

  

  

  const renderField = (field: ICmsGetContentModelDataField, objFieldId: string | null = null) : ReactElement<any, any> | undefined => {

    const validationRules = field.validation?.map(valid=> valid.settings?.preset)
    
    const validationSchema = validationRules && createValidationSchema(validationRules);

    const { handleSubmit, register, formState: {errors} } = useForm({
      resolver: zodResolver(validationSchema),
    });

    if (field.type === "text") {
      if (field.renderer.name === "checkboxes") {
        const arr = [] as string[]
        return (<div className="field form__checkboxes">
          <Form.Label>{field.label}</Form.Label>
         {field.predefinedValues?.values.map((value, index) => (
          <Form.Check
          defaultValue={
            rowState?.[objFieldId] ? rowState?.[objFieldId]?.[field.fieldId] : rowState ? rowState?.[field.fieldId] : undefined 
          }
            key={index}
            type="checkbox"
            id={value.value}
            label={value.label}
            onChange={(e) =>{
              if(objFieldId) {
                if(Array.isArray(formInputs[objFieldId][field.fieldId])) {
                  // setFormInputs((prevState) => ({ ...prevState, [`${objFieldId}`]: {...prevState[objFieldId], [field.fieldId]: value.value }}))
                  console.log({objFieldId})
                  setFormInputs((prevState:{ [key: string]: unknown | any })=> ({...prevState, [objFieldId]:{...prevState[objFieldId], [field.fieldId]: [...prevState[objFieldId][field.fieldId], value.value]}}))
                } else{
                  arr.push(value.value)
                  setFormInputs(prevState=> ({...prevState, [objFieldId]:{...prevState[objFieldId], [field.fieldId]: arr}}))
                }
              } else {
                if(Array.isArray(formInputs[field.fieldId])) {
                  setFormInputs((prevState: { [key: string]: unknown | any } )=> ({...prevState, [field.fieldId]: [...prevState[field.fieldId], value.value]}))
                } else{
                  arr.push(value.value)
                  setFormInputs(prevState=> ({...prevState, [field.fieldId]: arr}))
                }
              }
            }
          }
          >
          </Form.Check>
        ))}
          </div >)
      }else if(field.renderer.name === "select-box") {
        return (
        <div className="field form__select-box">
        <Form.Label>{field.label}</Form.Label>
        <Form.Select 
        defaultValue={
          rowState?.[objFieldId] ? rowState?.[objFieldId]?.[field.fieldId] : rowState ? rowState?.[field.fieldId] : undefined 
        }
        onChange={(e)=>{
          if(objFieldId) {
            setFormInputs((prevState: { [key: string]: unknown | {[key: string] : unknown} }) => ({ ...prevState, [`${objFieldId}`]: {...prevState[objFieldId], [field.fieldId]: e.target.value }}))
          } else {
            setFormInputs((prevState) => ({
              ...prevState,
              [`${field.fieldId}`]: e.target.value,
            }))
          }
        }
        }>
          {field.predefinedValues?.values.map(el=> <option value={el.value}>{el.label}</option>)}
        </Form.Select>
        </div>
        )
      } else if(field.renderer.name === "text-input"){

      const defaultValue = rowState?.[objFieldId]?.[field.fieldId] ? rowState?.[objFieldId]?.[field.fieldId] : rowState?.[field.fieldId] ? rowState?.[field.fieldId] : undefined 
      return (
        <div className="field form__text-input">
          <Form.Label>{field.label}</Form.Label>
          <Form.Control
            defaultValue={
              defaultValue 
            }
            onChange={(e) =>{
              if(objFieldId) {
                setFormInputs((prevState: { [key: string]: unknown } ) => ({ ...prevState, [`${objFieldId}`]: {...prevState[objFieldId], [field.fieldId]: e.target.value }}))
              } else {
                setFormInputs((prevState) => ({
                  ...prevState,
                  [`${field.fieldId}`]: e.target.value,
                }))
              }
            }
            }
          ></Form.Control>
        </div>
      )}
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
          <div className="field form__ref-input">
            <Form.Label>{field.label}</Form.Label>
            <Typeahead
            defaultValue={
              rowState?.[objFieldId] ? rowState?.[objFieldId]?.[field.fieldId] : rowState ? "" : undefined 
            }
            onChange={(e:any)=>{
              const ref:WebinyRefInput = {
                modelId: refs[0].modelId,
                id: e[0]?.id 
              }
              if (objFieldId) {
                (setFormObjField((prevState)=> ({...prevState, [`${field.fieldId}`]: ref})))
              }else{
                (setFormInputs((prevState)=> ({...prevState, [`${field.fieldId}`]: ref})))
              }
            }}
              id={field.fieldId}
              labelKey={(option: any)=> headers?.map((el:any)=> option[el]).join(" ")}
              
              options={options}
            />
          </div>
        );
      }else if(field.renderer.name === "ref-inputs") {
        return <div className="field form__ref-inputs">
        <Form.Label>{field.label}</Form.Label>
        <Typeahead
          placeholder={t("select-inputs") as string}
          id={field.fieldId}
          onChange={e=>{
            const refInputs = e.map((el: any)=>{
              const ref = {
                modelId: refs[0].modelId,
                id: el.id
              }
              return ref
            })
            if(e.length === 0) return
            if(objFieldId){
              setFormObjField(prevState=> ({...prevState, [`${field.fieldId}`]:refInputs}))
            }else{
              setFormInputs(prevState=> ({...prevState, [`${field.fieldId}`]:refInputs}))
            }
          
          }}
          labelKey={(option: any)=> headers.map(el=> option[el]).join(" ")}
          multiple
          options={options}
        />
      </div>
      }
    } else if (field.type === "long-text") {
      if(field.renderer.name === "long-text-text-area") {
        return (
        <div className="field form__long-text">
          <Form.Label >{field.label}</Form.Label>
          <FloatingLabel controlId="floatingTextarea2" label={field.helpText}>
            <Form.Control 
              defaultValue={
                rowState?.[objFieldId] ? rowState?.[objFieldId]?.[field.fieldId] : rowState ? rowState?.[field.fieldId] : undefined 
              }
              onChange={(e)=> {
                if (objFieldId) {
                  setFormInputs(prevState => ({...prevState, [`${field.fieldId}`]: e.target.value}))
                  // setFormInputs(prevState => ({...prevState, [`${objFieldId}`]: prevState[`${objFieldId}`], [`${field.fieldId}`]: e.target.value}))
                }else{
                  setFormInputs(prevState => ({...prevState, [`${field.fieldId}`]: e.target.value}))
                }
              }
              }
            
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: '100px' }}
              />
          </FloatingLabel>
        </div>
      )
      }
    }else if (field.type === "object" && field?.settings) {
      const objFieldId = field.fieldId
      // setFormObjFieldName(objFieldId)
      return (
        <div className="field form__object">
          <Form.Label>{field.label}</Form.Label>
          {field.settings.fields?.map(field=> renderField(field, objFieldId))}
        </div>
        )
      
    }

    
  };

  const onSubmit = async(dataInput: { [key: string]: unknown;}) => { 

    const createMutationStr = (fields: ICmsGetContentModelDataField[]): string  => {
      let str = ""

      fields.forEach(field=>{
        if(field.type === "text" || field.type === "long-text") {
          str += `${field.fieldId}\n`
        }
        else if(field.type === "ref") {
          str += `${field.fieldId} {
          modelId
          id
          __typename
        }\n`
        }else if (field.type === "object" && field?.settings) {
          const objFields = field.settings.fields

          if(!objFields) return
          str += `${field.fieldId} {
            ${createMutationStr(objFields)}
          }\n`
        }
      })

      return str
    }

    const fieldsKeysStr = createMutationStr(contentModel.fields) 
    
    
    try {
      let idToBePublished = ''

      if(rowState && rowId && updateRowModelId) {
        const {data} = await cmsCreateModelFrom(updateRowModelId, {...rowState, ...formInputs}, fieldsKeysStr, rowId )
        
        console.log({data})
        if(data.id) {
          const {data: publishedData} = await cmsPublishModelId(contentModel.modelId, data.id)
          
          if(!!publishedData){
            handleUpdatedGrid()
            setSuccessMsg(t("entry-updated") as string) 
          } 
        }
        
        return
      } 
      const {data} = await cmsEntriesCreateModel(contentModel.modelId, dataInput, fieldsKeysStr)
      console.log({data})
      if(data.id) {
        const {data: publishedData} = await cmsPublishModelId(contentModel.modelId, data.id)
        
        if(!!publishedData){
          handleUpdatedGrid()
          setSuccessMsg(t("entry-registered") as string) 
        } 
      }
        
    } catch (error) {
      console.error(error)
    }
  
  };

  const fields = () => {
    let num = 0
    if(num === contentModel.fields.length + 1) {
      setIsloading(false)
    }
    return contentModel.fields.map((field, index, arr) => {

      return renderField(field);
    })
  }

  return (
    <>
      <NewEntryFormStyles style={{display: isLoading ? "none" : "block"}}>
        <Form  className="new-entry new-entry-form" onSubmit={(e)=>{
        e.preventDefault()
        onSubmit(formInputs)}}>
        <Form.Group className="new-entry-form__group mb-3">
          {contentModel.fields.map((field, index, arr) => {
            return renderField(field);
          })}
        </Form.Group>
        <button>{t("submit-form")}</button>
        </Form>
      </NewEntryFormStyles>
      
    </>
  );
};

const NewEntryFormStyles = styled.div`
  position: relative;
  overflow-y: auto;
  margin-inline:auto;
  width: fit-content;
  z-index: 3;
  ::-webkit-scrollbar {
  z-index: 1;
  }
  border-radius: .3rem;
  .new-entry-form{
    padding: 1rem;
    width: 40em;
    border-radius: .3rem;
    background-color: white;
    &__group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
  .form{
    &__checkboxes{
      border: 1px solid #00000063;
      padding: .3rem;
      border-radius: .5rem;
    }
    &__object{

      border: 1px solid black;
      padding: .5rem .5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
  
  .skimmer {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__line {
      height: 10px;
      width: 100%;
      background-color: lightgray;
    }
  }

/* Style the scrollbar thumb */
::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

/* Change the color of the scrollbar thumb on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

/* Allow dragging of the scrollbar thumb */
::-webkit-scrollbar-thumb:active {
  background-color: #333;
}

/* Select the scrollbar track on hover */
::-webkit-scrollbar-track:hover {
  background-color: #f1f1f10;
}
`

export default NewEntryForm;
