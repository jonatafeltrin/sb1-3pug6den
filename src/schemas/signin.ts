import * as yup from 'yup';
export const SigninSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .test('EmailOrCpf', 'Digite um e-mail ou cpf válido', (value) => {
      const isEmail = yup.string().email().isValidSync(value);
      const isCPF = yup
        .string()
        .matches(/^(\d{3}\.?\d{3}\.?\d{3}-?\d{2})$/)
        .isValidSync(value);
      return isEmail || isCPF;
    }),
  password: yup.string().required(),
});
