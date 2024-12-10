import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSWRConfig } from 'swr';

import ModalNotification from './notificacoes/components/ModalNotificacoes/ModalNotificacao';
import { Notification } from './notificacoes/components/Notification';
import { EnumBFF } from './notificacoes/types/Notificacao.types';

import { AppBar } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { ApiRoutesEnum } from '@/enums';
import { API_BFF } from '@/services/api';

interface IRightHeader {
  modal: boolean;
  setModal: (param: boolean) => void;
  setType: (param: string) => void;
}
const Buffer = require('buffer').Buffer;
export default function NotificacoesDetalhe() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>('');
  const { showLoading, hideLoading } = useLoading();
  const params = useLocalSearchParams();
  const { mutate } = useSWRConfig();

  console.debug({
    message: params.message,
  });

  const { id, title, processType, document, date, expirationDate } = params;
  const message = Buffer.from(params.message, 'hex').toString('utf8');
  const expirePoints = processType == 'EXPIRE_POINTS';

  const handleUpdate = async (statusUpdate?: string) => {
    try {
      showLoading();
      await API_BFF.put(ApiRoutesEnum.NOTIFICATIONS, {
        notifications: [
          {
            id,
            title,
            message,
            status: statusUpdate,
            processType,
            document,
            date,
            expirationDate,
          },
        ],
      });
    } catch {
      Alert.alert('Alerta', 'Houve um erro ao processar sua solicitação');
    }

    const swrKey = ApiRoutesEnum.NOTIFICATIONS;
    mutate(swrKey);
    router.back();
    hideLoading();
  };

  return (
    <View style={styles.container}>
      <AppBar
        headerRight={
          !expirePoints && (
            <RightHeader modal={modalVisible} setModal={setModalVisible} setType={setTypeModal} />
          )
        }>
        {' '}
      </AppBar>

      <Notification.NotificationRoot title={title} message={message}>
        <Notification.NotificationRedeem />
        <Notification.NotificationRedirect />
      </Notification.NotificationRoot>

      <ModalNotification
        modalVisible={modalVisible}
        setModal={setModalVisible}
        type={typeModal}
        actionModal={(e) => {
          handleUpdate(typeModal);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#121A78',
    fontWeight: '400',
    paddingTop: 8,
  },
  message: {
    marginTop: 16,
    fontSize: 18,
    color: '#393939',
    fontWeight: '400',
  },
});

function RightHeader({ setModal, setType }: IRightHeader) {
  const handleModal = (type: string) => {
    setModal(true);
    setType(type);
  };
  return (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Feather
        name="trash-2"
        size={20}
        color="#121A78"
        onPress={() => handleModal(EnumBFF.EXCLUIDO)}
      />
      <MaterialIcons
        name="drive-file-move-outline"
        size={25}
        color="#121A78"
        onPress={() => handleModal(EnumBFF.ARQUIVADA)}
      />
    </View>
  );
}
