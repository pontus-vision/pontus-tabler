import Form from 'react-bootstrap/Form';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useTranslation } from 'react-i18next';

type Props = {
  isLoading: boolean;
};

const NewEntryFormSkeleton = ({ isLoading }: Props) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: isLoading ? 'block' : 'none' }}>
      <Form className="new-entry new-entry-form">
        <Form.Group className="new-entry-form__group mb-3">
          <div className="skeleton">
            <div className="skeleton__label"></div>
            <div className="skeleton__input"></div>
          </div>
          <div className="skeleton">
            <div className="skeleton__label"></div>
            <div className="skeleton__input"></div>
          </div>
          <div className="skeleton">
            <div className="skeleton__label"></div>
            <div className="skeleton__input"></div>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

export default NewEntryFormSkeleton;
