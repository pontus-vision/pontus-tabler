import { Dispatch, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type Props = {
  saveDashboard: (name: string) => void;
  setShowDashboardForm: Dispatch<React.SetStateAction<boolean>>;
};

const FormDashboard = ({ setShowDashboardForm, saveDashboard }: Props) => {
  const [name, setName] = useState<string>();
  const {t} = useTranslation()

  return (
    <>
    <div className="shadow"></div>
    <div className="dashboard-confirm-modal">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>{t("enter-dashboard-name")}</Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Dashboard"
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            name && saveDashboard(name);
          }}
          >
          {t("save")}
        </Button>
      </Form>
      <div className="shadow-form-dash"></div>
      <div className="exit-btn" onClick={() => setShowDashboardForm(false)}>
          <img className="xmark-icon" src="/src/assets/xmark-solid.svg" alt="xmark" />
      </div>
    </div>
          </>
  );
};

const FormDashboardStyles = styled.div`
  position: absolute;
  
  background-color: blue;
  padding: 3rem 5rem;
  /* z-index: 4; */
  label {
    color: white;
  }

  & .exit-btn {
    height: 2rem;
    width: 2rem;
    border-radius: 5rem;
    position: absolute;
    top: -1rem;
    right: -1rem;
    background-color: white;
    box-shadow: 0 0 2px black;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .shadow-form-dash{
    width: 100%;
    height: 100%;
  }
`;

export default FormDashboard;
