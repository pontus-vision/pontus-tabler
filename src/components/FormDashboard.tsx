import { Dispatch, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import styled from "styled-components";

type Props = {
  saveDashboard: (name: string) => void;
  setShowDashboardForm: Dispatch<React.SetStateAction<boolean>>;
};

const FormDashboard = ({ setShowDashboardForm, saveDashboard }: Props) => {
  const [name, setName] = useState<string>();

  return (
    <FormDashboardStyles>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Insira um nome para o dashboard</Form.Label>
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
          Salvar
        </Button>
      </Form>
      <div className="shadow"></div>
      <div className="exit-btn" onClick={() => setShowDashboardForm(false)}>
        X
      </div>
    </FormDashboardStyles>
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
`;

export default FormDashboard;
