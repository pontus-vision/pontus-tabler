import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import {
  ICmsGetContentModelData,
  ICmsGetContentModelDataField,
} from "../types";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { cmsGetContentModel, listModel } from "../client";

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
  const { data: modelContentListData, meta } = await listModel(
    modelId,
    columnNames,
    limit,
    after,
    fieldsSearches
  );

  // console.log({ columnNames });

  return { columnNames, modelContentListData, meta };
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
      if (field.renderer.name === "ref-input") {
        const refs = field?.settings?.models;

        console.log(refs);

        const options = getModelFieldsContent(model.modelId, 5, null);

        if (!refs) return;
        return (
          <>
            <Form.Label>ref{field.label}</Form.Label>
            <Typeahead
              id={field.fieldId}
              labelKey="option"
              options={refs.map((el) => el.modelId)}
            />
          </>
        );
      }
    }
  };

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
