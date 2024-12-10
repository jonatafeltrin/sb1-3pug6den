import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, StatusBar } from 'react-native';

import * as S from './styles';

import { ENV } from '@/@constants';
import CheckStatus from '@/assets/CheckStatus';
import { Button } from '@/components/Button';
import { StorageEnum } from '@/enums';
import { ILatestUpdates } from '@/types/LatestUpdates';

const defaultLatestUpdates: ILatestUpdates = {
  title: 'Parece que o seu aplicativo está desatualizado. ',
  description:
    'Por favor, clique no botão abaixo e atualize o seu aplicativo para aproveitar as últimas melhorias e correções.',
  features: [],
};

function UpdateModal({ onAction }: { onAction: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [latestUpdates, setLatestUpdates] = useState<ILatestUpdates>(defaultLatestUpdates);
  async function handleUpdate() {
    const appUrl = Platform.OS === 'ios' ? ENV.IOS_APP_URL : ENV.ANDROID_APP_URL;

    await Linking.openURL(appUrl);
    setIsOpen(false);
    onAction();
  }

  function handleDiscard() {
    setIsOpen(false);
    onAction();
  }

  const currentVersion = Updates.runtimeVersion;

  useEffect(() => {
    async function checkShouldOpen() {
      const latestRuntimeVersion = await SecureStore.getItemAsync(
        StorageEnum.LATEST_RUNTIME_VERSION,
      );

      if (latestRuntimeVersion !== currentVersion) {
        setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return;
      }

      setIsOpen(false);
      onAction();
    }

    checkShouldOpen();
  }, [currentVersion]);

  useEffect(() => {
    async function getLatestUpdates() {
      const latestUpdates = await SecureStore.getItemAsync(StorageEnum.LATEST_UPDATES);

      if (latestUpdates) {
        setLatestUpdates(JSON.parse(latestUpdates));
      }
    }

    getLatestUpdates();
  }, []);

  return (
    <Modal visible={isOpen} animationType="slide">
      <S.Container
        style={{
          marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 16 : 16,
        }}>
        <S.Banner>
          <S.BannerTextContainer>
            <S.BannerText>Ops, seu aplicativo</S.BannerText>
            <S.BannerText>está desatualizado!</S.BannerText>
          </S.BannerTextContainer>
          <S.BannerImage />
        </S.Banner>

        <S.ModalTitle>{latestUpdates.title}</S.ModalTitle>
        <S.ModalContent>{latestUpdates.description}</S.ModalContent>

        <S.UpdateListContainer>
          {latestUpdates.features?.map((feature) => (
            <S.UpdateListItem key={feature}>
              <CheckStatus />
              <S.UpdateListItemText>{feature}</S.UpdateListItemText>
            </S.UpdateListItem>
          ))}
        </S.UpdateListContainer>

        <S.ButtonsContainer>
          <Button onPress={handleUpdate}>Atualizar aplicativo</Button>
          <S.DiscardText onPress={handleDiscard}>Usar desatualizado</S.DiscardText>
        </S.ButtonsContainer>
      </S.Container>
    </Modal>
  );
}

export default UpdateModal;
