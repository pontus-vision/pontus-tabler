import { z } from "zod";

export const validateCPF = (value: string) => {
  const onlyNumbers = value.replace(/[^\d]/g, "");
  if (onlyNumbers.length !== 11) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(onlyNumbers[i - 1], 10) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(onlyNumbers[9], 10)) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(onlyNumbers[i - 1], 10) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(onlyNumbers[10], 10)) {
    return false;
  }

  return true;
};

export const cpfSchema = z.string().refine((value) => validateCPF(value), {
  message: "CPF inválido",
});

export const emailSchema = z.string().email({ message: "Email no formato errado" });

export const createValidationSchema = (types: string[]) => {
    const schemaFields = {} as any;

    types.forEach((type) => {
      switch (type) {
        case "cpf":
            schemaFields[type] = cpfSchema
          break;
        case "email":
            schemaFields[type] = emailSchema
          break;
        // Add more cases for other validation types as needed
        default:
          break;
      }
    });

    return z.object(schemaFields);
  };