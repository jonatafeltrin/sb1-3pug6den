import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Button, Text } from 'native-base';
import { FormProvider, useForm } from 'react-hook-form';

import * as S from './styles';

import { ENV } from '@/@constants';
import { AppBar, Input } from '@/components';
import { RoutesEnum } from '@/enums';
import { useTimer } from '@/hooks';
import { ForgotPasswordService } from '@/services';

export const VerificationCode = () => {
  const form = useForm({
    defaultValues: {
      key: '',
    },
  });
  async function handleSignup() {
    await WebBrowser.openBrowserAsync(ENV.SIGNUP_URL!);
  }
  const key = form.watch().key;
  const onSubmit = () => {
    router.push({
      pathname: RoutesEnum.FORGOT_PASSWORD_FORM,
      params: { ...params, key },
    });
  };
  const { time, setTime } = useTimer();
  const params = useLocalSearchParams();

  const regenCode = async () => {
    await ForgotPasswordService.submit({ username: params.username, method: params.method });

    setTime(180);
  };

  return (
    <>
      <AppBar>Esqueceu sua senha?</AppBar>
      <S.Container>
        <FormProvider {...form}>
          <Text color="grey.550" fontSize={18} my="24px">
            Se você tem conta, chegará no meio selecionado
          </Text>
          <Input label="Código" name="key" placeholder="Digite o código" />

          <Text color="grey.550" fontSize={16} my="24px">
            Se você não recebeu o código por e-mail ou sms, é possível que você não tenha conta.
            Para efetuar o cadastro{' '}
            <Text onPress={handleSignup} color="blue.500" textDecorationLine="underline">
              acesse aqui
            </Text>
          </Text>

          <Text
            color="grey.550"
            textAlign="center"
            fontSize={18}
            onPress={time > 0 ? undefined : regenCode}
            textDecorationLine={time > 0 ? 'none' : 'underline'}>
            {time > 0
              ? `Solicite um novo código em ${time} ${time === 1 ? 'segundo' : 'segundos'}`
              : 'Solicitar novo código'}
          </Text>

          <Button
            bgColor={!key ? 'gray.200' : 'blue.950'}
            width="100%"
            marginTop="auto"
            marginBottom="16px"
            disabled={!key}
            textAlign="center"
            onPress={onSubmit}>
            Próximo
          </Button>
        </FormProvider>
      </S.Container>
    </>
  );
};
