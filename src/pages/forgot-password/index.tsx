import { MaterialIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Button, Text } from 'native-base';
import { FormProvider, useForm } from 'react-hook-form';

import * as S from './styles';

import { ENV } from '@/@constants';
import { AppBar, Input } from '@/components';
import { RoutesEnum } from '@/enums';
import { EmailOrCpfSchema } from '@/schemas';

export const ForgotPassword = () => {
  const form = useForm({
    reValidateMode: 'onBlur',
    defaultValues: {
      username: '',
    },
    resolver: yupResolver(EmailOrCpfSchema),
  });
  const params = useLocalSearchParams();
  const onSubmit = async () => {
    router.push({
      pathname: RoutesEnum.FORGOT_PASSWORD_STRATEGY,
      params: {
        ...params,
        username: form.getValues().username,
      },
    });
  };
  const openAccountRecoveryForm = async () =>
    await WebBrowser.openBrowserAsync(ENV.RECOVERY_ACCOUNT_FORM_URL);

  return (
    <>
      <AppBar>Esqueceu sua senha?</AppBar>
      <S.Container>
        <FormProvider {...form}>
          <Text color="blue.950" fontSize={18} my="24px">
            Digite o endereço de e-mail ou CPF da sua Conta Portobello que enviaremos uma mensagem
            com link para redefinição de senha.
          </Text>
          <Input label="E-mail ou CPF" name="username" placeholder="Digite o e-mail ou cpf" />
          <S.Link onPress={openAccountRecoveryForm}>
            <MaterialIcons name="open-in-new" size={18} color="#1D2BC4" />
            <Text color="blue.600" fontWeight={600} alignItems="center">
              Caso você não tenha mais acesso a este e-mail, preencha o formulário de alteração
              cadastral e solicite a substituição pelo seu e-mail atual.
            </Text>
          </S.Link>

          <Button
            bgColor={!form.formState.isValid ? 'gray.200' : 'blue.950'}
            width="100%"
            marginTop="auto"
            marginBottom="16px"
            disabled={!form.formState.isValid}
            textAlign="center"
            onPress={onSubmit}>
            Próximo
          </Button>
        </FormProvider>
      </S.Container>
    </>
  );
};
