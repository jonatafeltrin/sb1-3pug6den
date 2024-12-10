import { yupResolver } from '@hookform/resolvers/yup';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Text } from 'native-base';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWR from 'swr';

import * as S from './styles';

import { AppBar, Input, KeyBoardAvoidingContainer, PhoneInput } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { useProfileForm } from '@/contexts/ProfileFormContext';
import { useAuth } from '@/contexts/auth';
import { ApiRoutesEnum, RoutesEnum } from '@/enums';
import { AddressFormSchema } from '@/schemas';
import { API_BFF } from '@/services/api';
import moment from 'moment';

export const AddressForm = () => {
  const form = useForm({
    reValidateMode: 'onSubmit',
    defaultValues: {
      emptyPhone: false,
      street: '',
      number: '',
      complement: '',
      city: '',
      state: '',
      mobile: '',
      neighborhood: '',
      cep: '',
      country: 'Brasil',
    },
    resolver: yupResolver(AddressFormSchema),
  });
  const [address, setAddress] = useState('');
  const { setValues } = useProfileForm();
  const params = useLocalSearchParams();
  const onSubmit = () => {
    setValues((old: any) => ({ ...old, address: form.getValues() }));
    router.push({ pathname: RoutesEnum.BUSINESS_FORM, params });
  };
  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();
  useSWR(
    address.length === 8 ? `${ApiRoutesEnum.ADDRESS}?cep=${address}` : null,
    (url) => {
      showLoading();
      return API_BFF.get(url);
    },
    {
      onSuccess: (data) => {
        form.setValue('city', data?.data?.city);
        form.setValue('neighborhood', data?.data?.neighborhood);
        form.setValue('state', data?.data?.state);
        form.setValue('street', data?.data?.street);
        hideLoading();
        setAddress('');
      },
      onError: () => {
        hideLoading();
        setAddress('');
      },
    },
  );
  const isEmptyPhone = Number(user?.profile?.mobile?.length || 0) < 11;
  const isInvalidBirthdate = !moment(user?.profile?.birthdate, 'YYYY-MM-DD', true).isValid();

  useEffect(() => {
    form.setValue('emptyPhone', isEmptyPhone);
    form.setValue('invalidBirthdate', isInvalidBirthdate);
  }, [user]);
  return (
    <>
      <AppBar>Completar cadastro</AppBar>
      <KeyBoardAvoidingContainer>
        <S.Container contentContainerStyle={{ padding: 16, gap: 24 }}>
          <FormProvider {...form}>
            {(isEmptyPhone || isInvalidBirthdate) && (
              <>
                <Text color="blue.900">Dados pessoais</Text>
                {isEmptyPhone && <PhoneInput />}
                {isInvalidBirthdate && (
                  <Input
                    name="birthdate"
                    placeholder="00/00/0000"
                    format="##/##/####"
                    label="Data de nascimento *"
                    keyboardType="numeric"
                    onChangeText={(text) => text?.length === 10 && form.trigger('birthdate')}
                  />
                )}
                <Text color="blue.900">Endereço</Text>
              </>
            )}
            <Input
              name="cep"
              placeholder="Informe o cep"
              label="CEP *"
              keyboardType="numeric"
              maxLength={9}
              onChangeText={(t) => {
                setAddress(t.replace(/\D/g, ''));
                form.setValue('cep', t.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2'));
              }}
            />
            <Input name="street" placeholder="Informe a rua" label="Rua *" />
            <Input
              name="number"
              placeholder="Informe o número"
              label="Número *"
              keyboardType="numeric"
            />
            <Input name="complement" placeholder="Informe o complemento" label="Complemento" />
            <Input name="neighborhood" placeholder="Informe o bairro" label="Bairro *" />
            <Input name="city" placeholder="Informe a cidade" label="Cidade *" />
            <Input name="state" placeholder="Informe o estado" label="Estado *" />
          </FormProvider>
        </S.Container>
        <S.BottomContainer>
          <Button
            bgColor={!form.formState.isValid ? 'gray.200' : 'blue.500'}
            width="100%"
            textAlign="center"
            disabled={!form.formState.isValid}
            onPress={onSubmit}>
            Próximo
          </Button>
        </S.BottomContainer>
      </KeyBoardAvoidingContainer>
    </>
  );
};
