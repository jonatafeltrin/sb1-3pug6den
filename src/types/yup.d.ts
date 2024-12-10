import { StringSchema } from 'yup';
declare module 'yup' {
  interface StringSchema {
    birthdate(message: string): StringSchema;
    cpf(): StringSchema;
    phone(): StringSchema;
  }
}
