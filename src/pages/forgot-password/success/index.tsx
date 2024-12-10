import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';

import * as S from './styles';

import { AppBar } from '@/components';
import { CheckIconSecondary } from '@/custom-icons/checkIcon';
import { RoutesEnum } from '@/enums';
export const Success = () => {
  const onSubmit = () => router.replace(RoutesEnum.INTRO);
  return (
    <>
      <AppBar
        icon={
          <TouchableOpacity onPress={onSubmit}>
            <Ionicons
              name="close-outline"
              size={24}
              color="#121A"
              style={{ marginRight: 'auto' }}
            />
          </TouchableOpacity>
        }>
        {' '}
      </AppBar>
      <S.Container>
        <CheckIconSecondary />
        <Text color="blue.950" fontSize={20} textAlign="center" bold mb="16px">
          Tudo certo!
        </Text>
        <Text color="grey.500" fontSize={18} textAlign="center">
          Sua senha foi alterada. Acesse novamente para aproveitar todos nossos serviços.
        </Text>
        <Button
          bgColor="blue.500"
          width="100%"
          marginTop="auto"
          marginBottom="16px"
          textAlign="center"
          onPress={onSubmit}>
          Ok, entendi
        </Button>
      </S.Container>
    </>
  );
};
