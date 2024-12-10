import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Button, Text } from 'native-base';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import * as S from './styles';

import { AppBar, Input, KeyBoardAvoidingContainer } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { useAuth } from '@/contexts/auth';
import { RoutesEnum } from '@/enums';
import { CpfSchema } from '@/schemas';
import { UserService } from '@/services';
import { setExpiresIn } from '@/utils';

export const CpfForm = () => {
  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      cpf: '',
    },
    resolver: yupResolver(CpfSchema),
  });
  const { user, setUser } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const onSubmit = async () => {
    showLoading();
    const values = form.getValues();
    const {
      given_name,
      email,
      mobile: phone,
      birthdate,
      address,
      family_name,
      city,
      cep,
      state,
      neighborhood,
      addressNumber,
      addressComplement,
    } = user?.profile || {};
    const cpf = values.cpf.replace(/\D/g, '');
    try {
      const formData = {
        name: given_name,
        email,
        phone,
        birthdate,
        lastName: family_name,
        address:
          typeof address === 'object'
            ? address
            : {
                street: address,
                number: addressNumber,
                complement: addressComplement,
                city,
                state,
                neighborhood,
                country: 'Brasil',
                cep,
              },
        cpf,
      };
      await UserService.updateAccount(formData);

      const data = { ...user, profile: { ...user?.profile, cpf } };
      setUser(data);
      await SecureStore.setItemAsync('user', JSON.stringify(data));

      if (user?.required_consent?.length) {
        hideLoading();
        router.replace({
          pathname: RoutesEnum.CONSENT_OPTIONS,
          params: {
            required_consent: JSON.stringify(user?.required_consent),
            profile: JSON.stringify({ ...user.profile, cpf }),
          },
        });
        return;
      }
      await setExpiresIn();

      router.replace(RoutesEnum.HOME);
    } catch (e) {
      const error = e as TError;
      Alert.alert(
        error?.response?.data?.errors?.[0]?.message || 'Não foi possível atualizar os seus dados',
      );
    }
    hideLoading();
  };
  return (
    <>
      <AppBar>Complete seu cadastro</AppBar>
      <KeyBoardAvoidingContainer keyboardVerticalOffset={20}>
        <S.Container contentContainerStyle={{ padding: 16, gap: 24 }}>
          <Text color="grey.500" fontSize="18px" my="16px">
            Detectamos que você não possui seu documento CPF cadastrado, atualize seu cadastro para
            utilizar o nosso aplicativo.
          </Text>
          <FormProvider {...form}>
            <Input
              name="cpf"
              placeholder="000.000.000-00"
              label="CPF *"
              format="###.###.###-##"
              keyboardType="numeric"
            />
          </FormProvider>
        </S.Container>

        <S.BottomContainer>
          <Button
            bgColor="blue.500"
            width="100%"
            textAlign="center"
            onPress={form.handleSubmit(onSubmit)}>
            Salvar
          </Button>
        </S.BottomContainer>
      </KeyBoardAvoidingContainer>
    </>
  );
};
