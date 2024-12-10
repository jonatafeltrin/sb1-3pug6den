import { Button, Heading, SmallCloseIcon } from 'native-base';
import { Alert, Modal, TouchableOpacity, View, Text } from 'react-native';

import { EnumBFF } from '../../types/Notificacao.types';

interface IModal {
  modalVisible: boolean;
  setModal: (modalVisible: boolean) => void;
  type: string;
  actionModal: (type?: 'string') => void;
  multipleItems?: boolean;
}

export default function ModalNotification({
  modalVisible,
  setModal,
  type,
  actionModal,
  multipleItems,
}: IModal) {
  const isTrash = type == EnumBFF.EXCLUIDO;

  const handleActionModal = () => {
    Alert.alert('Alerta', 'Você deseja prosseguir com a ação?', [
      {
        text: 'Sim',
        onPress: () => {
          actionModal();
          setModal(false);
        },
      },
      {
        text: 'Cancelar',
      },
    ]);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModal(!modalVisible);
      }}>
      <View
        style={{
          width: '100%',
          height: '35%',
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
            onPress={() => setModal(false)}>
            <SmallCloseIcon />
          </TouchableOpacity>
        </View>

        <Heading>{isTrash ? 'Atenção!' : 'Arquivar'}</Heading>
        <Text style={{ fontSize: 18, textAlign: 'center', color: '#4B4B4B', marginVertical: 8 }}>
          {isTrash
            ? `Você deseja apagar ${
                multipleItems ? 'as notificações' : 'a notificação'
              }? Após apagar você não poderá mais ${
                multipleItems ? 'visualizá-las.' : 'visualizá-la.'
              }`
            : `Você deseja arquivar ${multipleItems ? 'as notificações?' : 'a notificação?'}`}
        </Text>
        <Button
          width="full"
          bg={isTrash ? 'red.600' : 'blue.600'}
          size="lg"
          onPress={() => handleActionModal()}>
          {isTrash
            ? multipleItems
              ? 'Apagar notificações'
              : 'Apagar notificação'
            : multipleItems
              ? 'Arquivar notificações'
              : 'Arquivar notificação'}
        </Button>
      </View>
    </Modal>
  );
}
