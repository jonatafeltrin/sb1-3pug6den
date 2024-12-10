import * as yup from 'yup';
const emailMessage = 'Por favor, informe um endereço de e-mail válido';
export const SignupSchema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^[a-zA-Z\u00C0-\u024F\s]+\s+[a-zA-Z\u00C0-\u024F]/,
      'Por favor, informe seu nome completo',
    )
    .required('Por favor, informe seu nome completo'),
  email: yup
    .string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/, emailMessage)
    .required(emailMessage)
    .email(emailMessage),
  cpf: yup.string().required('Por favor, insira um CPF válido').cpf(),
  phone: yup.string().required('Por favor, informe um número de telefone válido').phone(),
  birthdate: yup
    .string()
    .birthdate('Você deve ter mais de 18 anos para participar da Comunidade +Arquitetura')
    .required('Você deve ter mais de 18 anos para participar da Comunidade +Arquitetura'),
});
