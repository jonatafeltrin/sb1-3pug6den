import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from 'native-base';
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import useSWR from 'swr';

import ItemList from './components/ItemList/ItemList';
import ModalNotification from './components/ModalNotificacoes/ModalNotificacao';
import { styles } from './styles';
import { EnumBFF, IData, NotificationTypes } from './types/Notificacao.types';

import { AppBar } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { useAuth } from '@/contexts/auth';
import { ApiRoutesEnum } from '@/enums';
import { API_BFF } from '@/services/api';

const scroll = ['TUDO', 'NAO_LIDA', 'LIDA', 'ARQUIVADA'];
const Buffer = require('buffer').Buffer;
export default function Notificacao() {
  const [groupValues, setGroupValues] = useState<string[]>([]);
  const [filterTag, setFilterTag] = useState(scroll[0]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>('');

  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const swrKey = ApiRoutesEnum.NOTIFICATIONS;

  const { data, isLoading, mutate } = useSWR<IData[]>(swrKey, async (url: string) => {
    const response = await API_BFF.post(ApiRoutesEnum.NOTIFICATIONS, {
      cpf: user?.profile.cpf,
    });
    return response.data;
  });

  if (isLoading) {
    showLoading();
  } else {
    hideLoading();
  }
  const handleFilter = (item: string) => {
    setGroupValues([]);
    setFilterTag(item);
  };

  const handleModal = (type: string) => {
    setModalVisible(true);
    setTypeModal(type);
  };

  const handleChangeStatus = async (status: string) => {
    const notifications: (IData | undefined)[] = groupValues.map((value) => {
      const notification: IData | undefined = data?.find((item) => item.id === value);
      if (notification) {
        notification.status = status;
        return notification;
      }
    });

    if (notifications.length > 0) {
      await updateDataNotifications(notifications as IData[]);
    }
  };

  const updateDataNotifications = async (notifications: IData[]) => {
    try {
      showLoading();
      await API_BFF.put(ApiRoutesEnum.NOTIFICATIONS, { notifications });
      setGroupValues([]);
      mutate();
    } catch {}
    hideLoading();
  };

  const filteredData =
    filterTag === EnumBFF.TUDO
      ? data
          ?.filter((itemFilter: IData) => itemFilter.status !== EnumBFF.ARQUIVADA)
          .sort((a, b) =>
            a.status === EnumBFF.DESTAQUE ? -1 : b.status === EnumBFF.DESTAQUE ? 1 : 0,
          )
      : data?.filter((itemFilter: IData) => itemFilter.status === filterTag);

  function handleChangeGroupValues(id: string) {
    const alreadyExists = groupValues.includes(id);

    if (alreadyExists) {
      setGroupValues((prev) => prev.filter((prevId) => prevId !== id));
      return;
    }

    setGroupValues((prev) => [...prev, id]);
  }

  return (
    <View style={{ flex: 1 }}>
      <AppBar>Notificações</AppBar>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Visualizar</Text>
        <ScrollView horizontal style={{ paddingTop: 8 }} showsHorizontalScrollIndicator={false}>
          {scroll.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => handleFilter(item)}
              style={[styles.badge, item == filterTag ? styles.badgeActive : null]}>
              <Text style={[styles.badgeText, item == filterTag ? styles.badgeTextActive : null]}>
                {NotificationTypes.hasOwnProperty(item)
                  ? NotificationTypes[item as keyof typeof NotificationTypes]
                  : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ marginBottom: 120 }}>
          {filteredData?.map((item) => (
            <ItemList
              checked={groupValues.includes(item.id)}
              onCheck={handleChangeGroupValues}
              key={item.id}
              item={item}
              onPress={() => {
                item.status === EnumBFF.NAO_LIDA &&
                  updateDataNotifications([{ ...item, status: EnumBFF.LIDA }]);
                router.push({
                  pathname: 'notificacoesDetalhe',
                  params: {
                    id: item.id,
                    title: item.title,
                    message: Buffer.from(item.message, 'utf8').toString('hex'),
                    redirectTo: item?.redirectTo,
                    status: item.status,
                    date: item.date,
                    expirationDate: item.expirationDate,
                    processType: item.processType,
                    document: item.document,
                  },
                });
              }}
            />
          ))}
          {filteredData?.length === 0 && (
            <View style={{ width: '100%', alignItems: 'center', padding: 24 }}>
              <Text fontSize="lg" fontWeight="bold" color="#9B9B9B">
                Você não tem notificações.
              </Text>
            </View>
          )}
        </View>
        <ModalNotification
          modalVisible={modalVisible}
          setModal={setModalVisible}
          type={typeModal}
          actionModal={() => handleChangeStatus(typeModal)}
          multipleItems={groupValues.length > 1}
        />
      </ScrollView>
      {groupValues.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 8,
            gap: 60,
            backgroundColor: '#fff',
            position: 'absolute',
            right: 0,
            left: 0,
            width: '100%',
            height: 80,
            bottom: 0,
            zIndex: 4,
          }}>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => handleChangeStatus(EnumBFF.NAO_LIDA)}>
            <Feather name="bookmark" size={20} />
            <Text>Não lida</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => handleModal(EnumBFF.ARQUIVADA)}>
            <Feather name="file" size={20} />
            <Text>Arquivar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => handleModal(EnumBFF.EXCLUIDO)}>
            <Feather name="trash-2" size={20} />
            <Text>Apagar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
