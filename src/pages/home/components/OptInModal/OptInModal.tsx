import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, StatusBar, Text, Linking, Dimensions, TouchableOpacity } from 'react-native';
import * as S from './styles';
import { Button } from '@/components/Button';
import { KeyBoardAvoidingContainer } from '@/components';
import { useAuth } from '@/contexts/auth';
import { API_BFF } from '@/services/api';
import { Spinner, View, CloseIcon, CheckIcon } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import DeviceInfo from 'react-native-device-info';
import { ApiRoutesEnum } from '@/enums';

const ID_CAMPAIGN = '1';
const screenWidth = Dimensions.get('window').width;

function OptInModal({ onAction }: { onAction: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const { getUser, setUser } = useAuth();
  const [ipAddress, setIpAddress] = useState<string>('');

  useEffect(() => {
    (async () => {
      const ip = await DeviceInfo.getIpAddress();
      setIpAddress(ip);

      await checkRegistration();
    })();
  }, []);

  const checkRegistration = async () => {
    try {
      const user = JSON.parse(await getUser());
      const document = user?.profile?.cpf;

      const response = await API_BFF.get(`${ApiRoutesEnum.OPTIN_GET}?document=${document}&campaign=${ID_CAMPAIGN}`);

      const { status } = response.data;

      if (status) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Erro ao verificar registro da campanha:', error);
      setIsOpen(true);
    }
  };

  async function onSubmit() {
    sendCampaignAcceptance(true);
  }

  async function handleDiscard() {
    sendCampaignAcceptance(false);
  }

  async function sendCampaignAcceptance(acceptance: boolean) {
    try {
      setIsAccepted(acceptance);
      setIsLoading(true);
      const user = JSON.parse(await getUser());

      const payload = {
        document: user?.profile?.cpf,
        acceptanceDate: new Date().toISOString().split('T')[0],
        acceptance,
        ipAddress,
        idCampaign: ID_CAMPAIGN,
        origin: 'app-mais-arquitetura',
      };
      await API_BFF.post(ApiRoutesEnum.OPTIN_POST, payload);

      if (acceptance) {
        const newUserData = { ...user, profile: { ...user.profile, hasSecondaryEmail: true } };
        setUser(newUserData);
        await SecureStore.setItemAsync('user', JSON.stringify(newUserData));
      }
      setIsSuccess(true);
      setIsLoading(false);
    } catch (error: any) {
      Alert.alert(
        'Alerta',
        error?.response?.data?.errors?.[0]?.message ||
        'Não foi possível atualizar sua participação, por favor, tente novamente mais tarde',
        [{ text: 'OK' }],
      );
      setIsLoading(false);
    }
  }

  function handlePress() {
    Linking.openURL(
      'https://docs.google.com/document/d/1JrBVn3k9o5egzGcpnNobqgaGOJsaF1Ycaq-mH3IuWa8/edit?pli=1',
    );
  }

  const closeModal = () => {
    setIsOpen(false);
    setIsSuccess(false);
    onAction();
  };

  return (
    <Modal visible={isOpen} animationType="slide">
      <KeyBoardAvoidingContainer keyboardVerticalOffset={1}>
        <S.Container
          style={{
            marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16,
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 21,
              left: 0,
              zIndex: 9999,
            }}
            onPress={closeModal}
          >
            <CloseIcon color="#121A78" size={4} />
          </TouchableOpacity>
          {isSuccess ? (
            <>
              <S.ModalContent>
                <View
                  style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 130, width: screenWidth - 32 }}
                >
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: '#4F46E5',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <CheckIcon onPress={closeModal} color="white" size={10} />
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 40 }}>Tudo certo!</Text>
                  <Text style={{ fontSize: 16, color: '#666', marginTop: 7, textAlign: 'center' }}>
                    {isAccepted ? 'Confirmação registrada' : 'Você não verá mais essa mensagem.'}
                  </Text>
                </View>
              </S.ModalContent>
              <S.ButtonsContainer>
                <Button onPress={closeModal}>
                  Voltar para a home
                </Button>
              </S.ButtonsContainer>
            </>
          ) : (
            <>
              <S.ModalTitle>Campanha Salão do Móvel</S.ModalTitle>
              <S.ModalContent>
                <Text style={{ fontSize: 17 }}>
                  Confirme sua participação na campanha Salão do Móvel. Confira os{' '}
                  <Text
                    style={{ color: 'blue', textDecorationLine: 'underline' }}
                    onPress={handlePress}>
                    Termos e Condições.
                  </Text>
                </Text>
              </S.ModalContent>
              <S.ButtonsContainer>
                <Button disabled={isLoading} onPress={onSubmit}>
                  {isLoading ? <Spinner color="white" /> : 'Confirmar'}
                </Button>
                <S.DiscardText onPress={handleDiscard}>
                  Não visualizar mais essa mensagem
                </S.DiscardText>
              </S.ButtonsContainer>
            </>
          )}
        </S.Container>
      </KeyBoardAvoidingContainer>
    </Modal>
  );
}

export default OptInModal;