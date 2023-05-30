import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import {
  ICmsGetContentModelData,
  ICmsGetContentModelDataField,
} from "../types";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { cmsGetContentModel } from "../client";

type Props = {
  contentModel: ICmsGetContentModelData;
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

        refs?.forEach((model) =>
          cmsGetContentModel(model.modelId).then((res) => console.log(res))
        );

        if (!refs) return;
        return (
          <>
            <Form.Label>{field.label}</Form.Label>
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
