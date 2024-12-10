import * as yup from 'yup';
export const ForgotPasswordSchema = yup.object().shape({
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], ' '),
  password: yup
    .string()
    .min(8, ' ')
    .matches(/[A-Z].*[A-Z]/, ' ')
    .matches(/[a-z]/, ' ')
    .matches(/[0-9]/, ' ')
    .matches(/[!@#$%&*(),.?":{}|<>]/, ' ')
    .required(),
});
export const EmailOrCpfSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .test('EmailOrCpf', 'Digite um e-mail ou cpf válido', (value) => {
      const isEmail = yup.string().email().isValidSync(value);
      const isCPF = yup
        .string()
        .matches(/^\d{3}\d{3}\d{3}\d{2}/)
        .isValidSync(value.replace(/\D/g, ''));

      return isCPF || isEmail;
    }),
});
