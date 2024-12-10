import { yupResolver } from '@hookform/resolvers/yup';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import { Button } from 'native-base';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import useSWR from 'swr';

import * as S from './styles';

import { AppBar, Input, Select } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { useProfileForm } from '@/contexts/ProfileFormContext';
import { useAuth } from '@/contexts/auth';
import { ApiRoutesEnum, RoutesEnum } from '@/enums';
import { BusinessFormSchema } from '@/schemas';
import { UserService } from '@/services';
import { API_BFF } from '@/services/api';

export const BusinessForm = () => {
  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      profession: '',
      company: '',
      companyCNPJ: '',
      adb: '',
      crea: '',
      cau: '',
    },
    resolver: yupResolver(BusinessFormSchema),
  });
  const { setValues, values } = useProfileForm();

  const { user, setUser } = useAuth();
  const params = useLocalSearchParams();
  const hasStoreInvite = !!user?.profile?.storeInvite;
  const onSubmit = async () => {
    const business = form.getValues();
    setValues((old: any) => ({ ...old, business }));

    if (hasStoreInvite) {
      const phone = values.address?.mobile || user?.profile?.mobilePhone || user?.profile?.mobile;
      const birthdate = values.address?.birthdate
        ? moment(values.address?.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : user?.profile?.birthdate;

      const formData = {
        name: user?.profile?.given_name,
        lastName: (user?.profile as any)?.lastName || user?.profile?.family_name,
        email: user?.profile?.email,
        cpf: user?.profile?.cpf,
        phone: phone ? phone.replace(/\D/g, '') : '',
        birthdate,
        address: values.address,
        profession: business?.profession,
        company: business?.company,
        companyCNPJ: business?.companyCNPJ,
        storeInvite: user?.profile.storeInvite,
        crea: business?.crea,
        cau: business?.cau,
        adb: business?.adb,
      };

      try {
        showLoading();
        await UserService.updateProfile(formData);

        const newUserData = {
          ...user,
          profile: {
            ...user?.profile,
            ...values?.address,
            shouldCompleteAccountBeforeRedeem: false,
            shouldCompleteAccountBeforeCheckin: false,
          },
        };

        setUser(newUserData);
        await SecureStore.setItemAsync('user', JSON.stringify(newUserData));
        router.replace(RoutesEnum.HOME);
      } catch (err) {
        const error = err as TError;
        Alert.alert(
          'Alerta',
          error?.response?.data?.errors?.[0]?.message || 'Não foi possível atualizar o seu perfil.',
        );
      }
      hideLoading();
    } else {
      router.push({ pathname: RoutesEnum.LAST_PROFILE_FORM, params });
    }
  };
  const { showLoading, hideLoading } = useLoading();
  const [options, setOptions] = useState<Option[]>([]);
  useSWR(
    ApiRoutesEnum.PROFESSIONS,
    (url) => {
      showLoading();

      return API_BFF.get(url);
    },
    {
      onSuccess: (data) => {
        setOptions(
          Array.isArray(data?.data)
            ? data.data.map((item: string) => ({ label: item, value: item }))
            : [],
        );
        hideLoading();
      },
      onError: () => hideLoading(),
    },
  );
  const keyboardVerticalOffset = Keyboard.isVisible() ? 0 : 80;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <AppBar>Profissão</AppBar>
      <FormProvider {...form}>
        <S.Container>
          <Select name="profession" placeholder="Selecione a profissão" options={options} />

          <S.Form
            contentContainerStyle={{
              flexDirection: 'column',
              flexGrow: 1,
              gap: 24,
            }}>
            <Input name="company" placeholder="Informe o nome" label="Nome da empresa" />
            <Input
              name="companyCNPJ"
              placeholder="Informe o CNPJ (opcional)"
              format="##.###.###/####-##"
              label="CNPJ da empresa"
            />

            {/* TODO: Refatorar isso */}
            {form.watch().profession === 'Designer de Interiores' && (
              <Input name="adb" placeholder="Informe o adb" label="ABD*" />
            )}
            {form.watch().profession === 'Arquiteto(a)' && (
              <Input name="cau" placeholder="Informe o cau" label="CAU*" />
            )}
            {form.watch().profession === 'Engenheiro(a) Civil' && (
              <Input name="crea" placeholder="Informe o CREA" label="CREA*" />
            )}
            <S.BottomContainer>
              <Button
                variant="outline"
                onPress={router.back}
                width="100%"
                mt={8}
                textAlign="center"
                borderColor="blue.500"
                _text={{ color: 'blue.500' }}>
                Voltar
              </Button>
              <Button
                bgColor={!form.formState.isValid ? 'gray.200' : 'blue.500'}
                width="100%"
                disabled={!form.formState.isValid}
                textAlign="center"
                onPress={onSubmit}>
                {hasStoreInvite ? 'Confirmar' : 'Próximo'}
              </Button>
            </S.BottomContainer>
          </S.Form>
        </S.Container>
      </FormProvider>
    </KeyboardAvoidingView>
  );
};
