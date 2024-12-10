import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Heading, SmallCloseIcon, Text } from 'native-base';
import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Modal, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import WebView from 'react-native-webview';

import { useLoading } from '../../contexts/LoadingOverlay';
import { enumSVG } from '../../utils/svgEnum';

import { AppBar } from '@/components';
import { ApiRoutesEnum, RoutesEnum } from '@/enums';
import { API_BFF } from '@/services/api';
import encoding from '@/utils/encoding';

export default function CheckinConfirm() {
  const { showLoading, hideLoading } = useLoading();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const params = useLocalSearchParams();

  const { cnpj, type, latitude, longitude, name, address, eventId } = params;

  const isStore = type === 'store';
  const handleCheckIn = async () => {
    const result: string | null = await SecureStore.getItemAsync('user');
    const user = result !== null && JSON.parse(result);

    showLoading();
    setModalVisible(false);
    API_BFF.post(`${ApiRoutesEnum.CHECK_IN}/${params?.type}`, {
      cpf: user?.profile?.cpf,
      [isStore ? 'cnpj' : 'eventId']: isStore ? cnpj : eventId,
    })
      .then((res) => {
        router.push('/modalCheckin');
        hideLoading();
      })
      .catch((err) => {
        hideLoading();
        Alert.alert('Alerta', err.response.data.errors[0].message, [{ text: 'OK' }]);
      });
  };
  const handleModalCheckIn = () =>
    router.push({
      pathname: RoutesEnum.CHECK_IN_MODAL,
      params: {
        ...params,
        message: isStore ? 'nesta loja' : 'neste evento',
        key: isStore ? 'cnpj' : 'eventId',
        type,
        id: isStore ? cnpj : eventId,
      },
    });

  return (
    <View style={{ flex: 1 }}>
      <AppBar>{isStore ? 'Loja' : 'Evento'}</AppBar>

      {isStore && (
        <WebView
          pointerEvents="none"
          style={{ backgroundColor: '#fff' }}
          source={{
            html: `<iframe style="width: 100%; height: 100%;" src = "https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;z=20&amp;output=embed"></iframe>`,
          }}
        />
      )}
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          paddingBottom: 36,
        }}>
        <View>
          <Text color="blue.950" fontSize={20} my={8} style={{ textTransform: 'capitalize' }}>
            {encoding.transformFromHexToUtf(name as string)}
          </Text>

          {isStore && (
            <Text color="gray.700" fontSize={18}>
              {encoding.transformFromHexToUtf(address as string)}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleModalCheckIn}>
          <Text style={{ color: '#fff' }}>Fazer Check-In</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            width: '100%',
            height: '42%',
            bottom: 0,
            left: 0,
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 35,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            gap: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '100%',
            }}>
            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 20,
                borderColor: '#ddd',
                borderWidth: 1,
              }}
              onPress={() => setModalVisible(false)}>
              <SmallCloseIcon />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: '#525EE5',
              borderRadius: 40,
              width: 74,
              height: 74,
              padding: 16,
            }}>
            <SvgXml xml={enumSVG.map} width="100%" height="100%" />
          </View>
          <Heading>Check-in</Heading>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>
            Você confirma o seu check-in {isStore ? 'nesta loja' : 'nesse evento'}?
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => handleCheckIn()}>
            <Text style={{ color: '#fff' }}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {},
  labels: {
    color: '#393939',
    marginVertical: 10,
  },
  itemList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2E3DE0',
    padding: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
});
