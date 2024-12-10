import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, StatusBar } from 'react-native';
import * as S from './styles';

import { Button } from '@/components/Button';
import { Input, KeyBoardAvoidingContainer } from '@/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/contexts/auth';
import { useLoading } from '@/contexts/LoadingOverlay';
import { API_BFF } from '@/services/api';
import { ApiRoutesEnum } from '@/enums';
import { Spinner } from 'native-base';
import * as SecureStore from 'expo-secure-store';

type SecondaryEmailFormValues = {
  email: string;
};

const validationMessage = 'É necessário inserir um e-mail válido';

const SecondaryEmailModalSchema = yup.object().shape({
  email: yup.string().email(validationMessage).required(validationMessage),
});

function SecondaryEmailModal({ onAction }: { onAction: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getUser, setUser } = useAuth();

  useEffect(() => {
    async function checkShouldOpen() {
      const user = JSON.parse(await getUser());

      const { hasSecondaryEmail } = user.profile;

      if (!hasSecondaryEmail) {
        setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return;
      }
      handleDiscard();
    }

    checkShouldOpen();
  }, []);

  function handleDiscard() {
    setIsOpen(false);
    onAction();
  }

  const form = useForm<SecondaryEmailFormValues>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(SecondaryEmailModalSchema),
  });

  const { getValues } = form;

  async function onSubmit() {
    try {
      setIsLoading(true);
      const user = JSON.parse(await getUser());
      await API_BFF.put(`${ApiRoutesEnum.SECONDARY_EMAIL}`, {
        idUser: user?.profile?.id,
        secondaryEmail: getValues().email,
      });

      const newUserData = { ...user, profile: { ...user.profile, hasSecondaryEmail: true } };
      setUser(newUserData);
      await SecureStore.setItemAsync('user', JSON.stringify(newUserData));

      handleDiscard();
    } catch (error: any) {
      Alert.alert(
        'Alerta',
        error?.response?.data?.errors?.[0]?.message ||
          'Não foi possível atualizar o seu email secundário, por favor, tente novamente mais tarde',
        [{ text: 'OK' }],
      );
    }
    setIsLoading(false);
  }

  return (
    <Modal visible={isOpen} animationType="slide">
      <KeyBoardAvoidingContainer keyboardVerticalOffset={1}>
        <S.Container
          style={{
            marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16,
          }}>
          <S.ModalTitle>E-mail para recuperação de conta</S.ModalTitle>
          <S.ModalContent>
            Digite um endereço de e-mail alternativo na qual você tenha acesso. Este e-mail será
            utilizado para o envio de um link de recuperação, caso não consiga acessar sua Conta
            Portobello no futuro.
          </S.ModalContent>

          <FormProvider {...form}>
            <Input label="E-mail alternativo" name="email" keyboardType="email-address" />
            <S.ButtonsContainer>
              <Button disabled={isLoading} onPress={form.handleSubmit(onSubmit)}>
                {isLoading ? <Spinner color={'white'} /> : 'Salvar e-mail alternativo'}
              </Button>
              <S.DiscardText onPress={handleDiscard}>Escolher depois</S.DiscardText>
            </S.ButtonsContainer>
          </FormProvider>
        </S.Container>
      </KeyBoardAvoidingContainer>
    </Modal>
  );
}

export default SecondaryEmailModal;
