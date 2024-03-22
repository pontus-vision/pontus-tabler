import { Dispatch, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import { useTranslation } from 'react-i18next';

type Props = {
  saveDashboard: (name: string) => void;
  setShowDashboardForm: Dispatch<React.SetStateAction<boolean>>;
};

const FormDashboard = ({ setShowDashboardForm, saveDashboard }: Props) => {
  const [name, setName] = useState<string>();
  const { t } = useTranslation();

  return (
    <>
      <div className="shadow"></div>
      <div className="dashboard-confirm-modal">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t('enter-dashboard-name')}</Form.Label>
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
            {t('save')}
          </Button>
        </Form>
        <div className="shadow-form-dash"></div>
        <div className="exit-btn" onClick={() => setShowDashboardForm(false)}>
          <img
            className="xmark-icon"
            src="/src/assets/xmark-solid.svg"
            alt="xmark"
          />
        </div>
      </div>
    </>
  );
};

export default FormDashboard;
