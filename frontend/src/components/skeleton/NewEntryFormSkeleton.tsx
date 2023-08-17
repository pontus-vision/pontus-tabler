import Form from 'react-bootstrap/Form';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type Props = {
  isLoading: boolean;
};

const NewEntryFormSkeleton = ({ isLoading }: Props) => {
  const { t } = useTranslation();

  return (
    <NewEntryFormStyles style={{ display: isLoading ? 'block' : 'none' }}>
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
    </NewEntryFormStyles>
  );
};

const NewEntryFormStyles = styled.div`
  position: relative;
  /* z-index: 2; */
  overflow-y: auto;
  margin-inline: auto;
  width: fit-content;
  .new-entry-form {
    padding: 1rem;
    width: 40em;
    background-color: white;
    &__group {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
  }
  .form {
    &__checkboxes {
      border: 1px solid black;
      padding: 0.3rem;
    }
  }

  .skeleton {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__label {
      animation: skimmerAnimation 1.5s infinite linear;
      height: 18px;
      background-color: lightgray;
    }

    &__input {
      height: 38px;
      width: 100%;
      background-color: lightgray;
      border-radius: 3px;
      animation: skimmerAnimation 1.8s infinite linear;
    }
  }

  @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (orientation: portrait) {
    /* CSS styles for iPhone portrait mode */
    width: 100%;
    .new-entry {
      width: 100%;
    }
  }

  @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (orientation: landscape) {
    /* CSS styles for iPhone landscape mode */
  }

  /* Target iPad */
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
    /* CSS styles for iPad portrait mode */
  }

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) {
    /* CSS styles for iPad landscape mode */
  }

  @keyframes skimmerAnimation {
    0% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.4;
    }
  }
`;

export default NewEntryFormSkeleton;
