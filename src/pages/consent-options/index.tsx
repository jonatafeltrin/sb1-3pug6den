import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Button, Checkbox, Text } from 'native-base';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import * as S from './styles';

import { ENV } from '@/@constants';
import { AppBar } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { RoutesEnum } from '@/enums';
import { UserService } from '@/services';
import { setExpiresIn } from '@/utils';

export const ConsentOptions = () => {
  const params = useLocalSearchParams();
  const options: { title: string; id: string; required: string }[] = JSON.parse(
    (params.required_consent as string) || JSON.stringify([]),
  );
  const user = params.profile ? JSON.parse(params.profile as string) : {};
  const [acceptedConsentOptionsIds, setAcceptedConsentOptions] = useState<string[]>([]);
  const openPrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync(ENV.PRIVACY_URL);
  };
  const openTerms = async () => {
    await WebBrowser.openBrowserAsync(ENV.TERMS_URL);
  };
  const openRules = async () => {
    await WebBrowser.openBrowserAsync(ENV.RELATIONSHIP_URL);
  };

  const handleCheckboxToggle = (item: string) => {
    if (acceptedConsentOptionsIds.includes(item)) {
      setAcceptedConsentOptions((old) => old.filter((value) => value !== item));
    } else {
      setAcceptedConsentOptions((old) => [...old, item]);
    }
  };
  const { showLoading, hideLoading } = useLoading();
  const requiredOptions = options.filter((o) => o.required === 'yes').map((o) => o.id);
  const isValid = () => requiredOptions.every((o) => acceptedConsentOptionsIds.includes(o));
  const onSubmit = async () => {
    showLoading();
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
      cpf,
      addressComplement,
    } = user;
    try {
      const formData = {
        name: given_name,
        email,
        phone,
        birthdate,
        lastName: family_name,
        address: {
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
        acceptedConsentOptionsIds,
      };
      await UserService.updateAccount(formData);
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
  const components = [
    {
      title: 'Política',
      component: (id: string) => (
        <Checkbox
          key={id}
          colorScheme="blue"
          _text={{ fontSize: 14 }}
          value="1"
          flexDirection="row-reverse"
          testID="option_1"
          isChecked={acceptedConsentOptionsIds.includes(id)}
          pointerEvents="none"
          onChange={() => handleCheckboxToggle(id)}>
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
      ),
    },
    {
      title: 'Aceito',
      component: (id: string) => (
        <Checkbox
          _text={{ fontSize: 14 }}
          colorScheme="blue"
          value="2"
          testID="option_2"
          pointerEvents="none"
          flexDirection="row-reverse"
          isChecked={acceptedConsentOptionsIds.includes(id)}
          onChange={() => handleCheckboxToggle(id)}>
          <Text width="95%">Aceito receber novidades da Portobello{`\n`}por e-mail ou SMS</Text>
        </Checkbox>
      ),
    },
    {
      title: 'Regulamento',
      component: (id: string) => (
        <Checkbox
          _text={{ fontSize: 14 }}
          colorScheme="blue"
          pointerEvents="none"
          value="3"
          testID="option_3"
          flexDirection="row-reverse"
          isChecked={acceptedConsentOptionsIds.includes(id)}
          onChange={() => handleCheckboxToggle(id)}>
          <Text width="95%">
            Li e aceito o{' '}
            <Text color="blue.500" onPress={openRules}>
              Regulamento do programa{`\n`}de relacionamento
            </Text>
          </Text>
        </Checkbox>
      ),
    },
  ];
  return (
    <S.Container>
      <AppBar>Política de privacidade e termos</AppBar>

      <S.Content>
        <Text color="blue.800" fontSize="20px" marginTop="16px">
          É necessário que você aceite nossos termos de uso.
        </Text>
        <S.ContainerCheckBox>
          {options.map((item) => {
            const element = components.find((i) => item.title.includes(i.title));
            return element?.component(item.id);
          })}
        </S.ContainerCheckBox>
        <Button
          bgColor="blue.500"
          width="100%"
          disabled={!isValid()}
          marginTop="auto"
          onPress={onSubmit}
          textAlign="center"
          testID="confirm-button">
          Confirmar
        </Button>
      </S.Content>
    </S.Container>
  );
};
