import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Button, Checkbox, Text } from 'native-base';
import { useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import useSWR from 'swr';

import * as S from './styles';

import { ENV } from '@/@constants';
import { Input, KeyBoardAvoidingContainer } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { useProfileForm } from '@/contexts/ProfileFormContext';
import { LogoIcon } from '@/custom-icons/logo';
import { ApiRoutesEnum, RoutesEnum } from '@/enums';
import { SignupSchema } from '@/schemas';
import { SignupService } from '@/services';
export const SignupForm = () => {
  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      cpf: '',
      birthdate: '',
      email: '',
      phone: '',
    },
    resolver: yupResolver(SignupSchema),
  });
  const { setValues } = useProfileForm();
  const isValid = () =>
    acceptedConsentOptionsIds.includes(getOption('Declaro')?.id) &&
    acceptedConsentOptionsIds.includes(getOption('Regulamento')?.id);
  const scrollViewRef = useRef<ScrollView>();
  const onSubmit = () => {
    if (!isValid()) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
      return;
    }
    setValues((old: Record<string, string>) => ({
      ...old,
      profile: { ...form.getValues(), acceptedConsentOptionsIds },
    }));
    router.push(RoutesEnum.MEMBER_GET_MEMBER);
  };
  const openPrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync(ENV.PRIVACY_URL);
  };
  const openTerms = async () => {
    await WebBrowser.openBrowserAsync(ENV.TERMS_URL);
  };
  const openRules = async () => {
    await WebBrowser.openBrowserAsync(ENV.RELATIONSHIP_URL);
  };
  const { showLoading, hideLoading } = useLoading();
  const swr = useSWR(
    ApiRoutesEnum.CONSENT_OPTIONS,
    () => {
      showLoading();
      return SignupService.getConsentOptions();
    },
    {
      onSuccess: (data) => {
        hideLoading();
        return data;
      },
    },
  );

  const options: TOption[] = Array.isArray(swr?.data?.data) ? swr?.data?.data : [];
  const getOption = (label: string) =>
    options.find((o: { label: string }) => o.label.includes(label))!;
  const [acceptedConsentOptionsIds, setAcceptedConsentOptions] = useState<string[]>([]);
  const handleCheckboxToggle = (item: string) => {
    if (acceptedConsentOptionsIds.includes(item)) {
      setAcceptedConsentOptions((old) => old.filter((value) => value !== item));
    } else {
      setAcceptedConsentOptions((old) => [...old, item]);
    }
  };

  if (!options?.length) {
    return null;
  }
  return (
    <KeyBoardAvoidingContainer keyboardVerticalOffset={20}>
      <S.Container
        contentContainerStyle={{ padding: 16, gap: 24 }}
        ref={scrollViewRef}
        testID="scroll">
        <LogoIcon />
        <Text color="blue.800" fontSize="20px">
          Você ainda não tem uma conta, mas não se preocupe, vamos criá-la para você.
        </Text>
        <FormProvider {...form}>
          <Input
            name="name"
            placeholder="Nome e Sobrenome"
            contextMenuHidden
            label="Nome completo"
          />
          <Input
            name="cpf"
            placeholder="000.000.000-00"
            label="CPF"
            format="###.###.###-##"
            keyboardType="numeric"
          />
          <Input
            name="birthdate"
            placeholder="00/00/0000"
            format="##/##/####"
            label="Data de nascimento"
            keyboardType="numeric"
          />
          <Input
            name="phone"
            keyboardType="numeric"
            placeholder="(00) 000000000"
            label="Telefone"
            format="(##) #########"
          />
          <Input name="email" placeholder="Digite seu e-mail" label="E-mail" />
          <S.ContainerCheckBox>
            <Checkbox
              colorScheme="blue"
              _text={{ fontSize: 14 }}
              value="1"
              flexDirection="row-reverse"
              testID="option_1"
              isChecked={acceptedConsentOptionsIds.includes(getOption('Declaro')?.id)}
              pointerEvents="none"
              onChange={() => handleCheckboxToggle(getOption('Declaro')?.id)}>
              <Text width="95%">
                Declaro que tenho mais de 18 anos,{`\n`}que li e concordo com as{' '}
                <Text color="blue.500" onPress={openPrivacyPolicy}>
                  Políticas de{`\n`}Privacidade{' '}
                </Text>
                e{' '}
                <Text color="blue.500" onPress={openTerms}>
                  Termos de Uso
                </Text>
              </Text>
            </Checkbox>
            <Checkbox
              _text={{ fontSize: 14 }}
              colorScheme="blue"
              value="2"
              testID="option_2"
              pointerEvents="none"
              flexDirection="row-reverse"
              isChecked={acceptedConsentOptionsIds.includes(getOption('Aceito')?.id)}
              onChange={() => handleCheckboxToggle(getOption('Aceito')?.id)}>
              <Text width="95%">Aceito receber novidades da Portobello{`\n`}por e-mail ou SMS</Text>
            </Checkbox>
            <Checkbox
              _text={{ fontSize: 14 }}
              colorScheme="blue"
              pointerEvents="none"
              value="3"
              testID="option_3"
              flexDirection="row-reverse"
              isChecked={acceptedConsentOptionsIds.includes(getOption('Regulamento')?.id)}
              onChange={() => handleCheckboxToggle(getOption('Regulamento')?.id)}>
              <Text width="95%">
                Li e aceito o{' '}
                <Text color="blue.500" onPress={openRules}>
                  Regulamento do programa{`\n`}de relacionamento
                </Text>
              </Text>
            </Checkbox>
          </S.ContainerCheckBox>
        </FormProvider>
      </S.Container>
      <S.BottomContainer>
        <Button
          bgColor={!isValid() ? 'gray.200' : 'blue.500'}
          width="100%"
          textAlign="center"
          onPress={form.handleSubmit(onSubmit)}
          testID="next-button">
          Próximo
        </Button>
      </S.BottomContainer>
    </KeyBoardAvoidingContainer>
  );
};
