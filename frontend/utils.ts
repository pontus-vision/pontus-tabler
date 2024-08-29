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

export const deepEqual = (obj1: Record<any, any>, obj2: Record<any, any>) => {
  // Check if both objects are null or undefined
  if (obj1 === obj2) {
    return true;
  }

  // Check if either object is null or undefined
  if (obj1 === null || obj2 === null) {
    return false;
  }

  // Check if both objects are of the same type
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  // If both objects are arrays, compare their lengths and elements
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }

  // If both objects are objects, compare their properties
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  }

  // If neither of the above conditions are met, compare primitive values
  return obj1 === obj2;
};

export const base64UrlDecode = (str) => {
  // Replace '-' with '+' and '_' with '/'
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad the string with '=' to make its length a multiple of 4
  while (str.length % 4) {
    str += '=';
  }
  // Decode the Base64 string
  return atob(str);
};

export const getJwtClaims = (token) => {
  // Split the token into parts
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }
  // Decode the payload
  const payload = base64UrlDecode(parts[1]);
  // Parse the JSON string to get the claims
  const claims = JSON.parse(payload);
  return claims;
};

export const getUserIdFromToken = (): string => {
  const storedAuth = localStorage.getItem('accessToken');
  const token = storedAuth && storedAuth.split(' ')[1];
  const claims = getJwtClaims(token);
  const userId = claims.userId;
  return userId;
};
