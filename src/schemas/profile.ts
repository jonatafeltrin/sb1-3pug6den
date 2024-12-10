import * as yup from 'yup';
export const AddressFormSchema = yup.object().shape({
  emptyPhone: yup.boolean(),
  invalidBirthdate: yup.boolean(),
  street: yup.string().required(),
  number: yup.string().required(),
  complement: yup.string(),
  city: yup.string().required(),
  mobile: yup.string().when('emptyPhone', {
    is: true,
    then: () => yup.string().required().min(12, ''),
  }),
  birthdate: yup.string().when('invalidBirthdate', {
    is: true,
    then: () =>
      yup
        .string()
        .birthdate('Você deve ter mais de 18 anos para participar da Comunidade +Arquitetura')
        .required('Você deve ter mais de 18 anos para participar da Comunidade +Arquitetura'),
  }),
  state: yup.string().required(),
  neighborhood: yup.string().required(),
  cep: yup.string().required().min(8, ' '),
  country: yup.string(),
});
export const LastFormSchema = yup.object().shape({
  storeInvite: yup.array().min(1),
  friendEmailInvite: yup.string().when('storeInvite', {
    is: (value: string[]) => value.includes('indicacao'),
    then: () => yup.string().email().required().typeError('Digite um e-mail válido'),
  }),
  friendNameInvite: yup.string().when('storeInvite', {
    is: (value: string[]) => value.includes('indicacao'),
    then: () => yup.string().required(),
  }),
  storeCNPJ: yup.string().when('storeInvite', {
    is: (value: string[]) => value?.includes('conviteLoja'),
    then: () => yup.string().required(),
  }),
});
export const BusinessFormSchema = yup.object().shape({
  profession: yup.string().required(),
  company: yup.string(),
  companyCNPJ: yup.string(),
  //TODO: Refatorar isso
  adb: yup.string().when('profession', {
    is: (value: string) => value === 'Designer de Interiores',
    then: () => yup.string().required(),
  }),
  crea: yup.string().when('profession', {
    is: (value: string) => value === 'Engenheiro(a) Civil',
    then: () => yup.string().required(),
  }),
  cau: yup.string().when('profession', {
    is: (value: string) => value === 'Arquiteto(a)',
    then: () => yup.string().required(),
  }),
});
export const CpfSchema = yup.object().shape({
  cpf: yup
    .string()
    .required()
    .test('string', 'Digite um cpf válido', (value) => value.length === 14),
});
