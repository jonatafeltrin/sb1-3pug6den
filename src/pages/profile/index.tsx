import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'native-base';
import { Alert } from 'react-native';

import * as S from './styles';

import { Action, AppBar } from '@/components';
import { useAuth } from '@/contexts/auth';
import { PersonIcon } from '@/custom-icons/person';
import { RoutesEnum } from '@/enums';

export const Profile = () => {
  const { signOut, user } = useAuth();
  const handleToAccount = () => router.push(RoutesEnum.PROFILE_ACCOUNT);
  const handleSignOut = () =>
    Alert.alert('Alerta', 'Você está encerrando a sessão.', [
      {
        text: 'Confirmar',
        onPress: signOut,
      },
      {
        text: 'Cancelar',
      },
    ]);
  return (
    <>
      <AppBar variant="secondary"> Perfil</AppBar>

      <S.Container>
        <S.Header>
          <PersonIcon />
          <Text color="white" fontSize={20} fontWeight={600} marginTop={2} textAlign="center">
            {user?.profile?.given_name}
          </Text>
          <Text color="white" fontSize={16} lineHeight={0}>
            {user?.profile?.email}
          </Text>
        </S.Header>

        <Action onPress={handleToAccount}>Conta</Action>
        <Action onPress={handleSignOut}>Sair</Action>
      </S.Container>
    </>
  );
};
