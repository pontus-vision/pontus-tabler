import { ChangeEvent, Dispatch, SetStateAction } from 'react';

export const handleInputChange = (
  e: ChangeEvent<HTMLInputElement>,
  field: string,
  setValidationError: Dispatch<SetStateAction<Record<string, any>>>,
) => {
  const inputValue = e.target.value;

  const pattern = /^[a-zA-Z0-9 ]{3,63}$/;
  if (!pattern.test(inputValue)) {
    setValidationError((prevState) => ({
      ...prevState,
      [field]:
        'Please enter only letters, numbers, and spaces (3 to 63 characters).',
    }));
  } else {
    setValidationError((prevState) => ({
      ...prevState,
      [field]: '',
    }));
  }
};
