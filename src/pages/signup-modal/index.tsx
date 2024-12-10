import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { Button, Text } from 'native-base';

import * as S from './styles';

import { RoutesEnum } from '@/enums';

export const SignupModal = () => {
  const pathname = usePathname();
  const params = useLocalSearchParams();
  if (!pathname.includes(RoutesEnum.SIGNUP_MODAL)) {
    return null;
  }

  const openUrl = () => {
    router.back();
    router.push({ pathname: RoutesEnum.ADDRESS_FORM, params });
  };
  return (
    <>
      <S.Container>
        <Text fontSize="md" mt={2} textAlign="center" color="black">
          É necessário completar o seu cadastro para realizar essa ação!
        </Text>
        <Button
          bgColor="blue.500"
          width="100%"
          mt={8}
          textAlign="center"
          onPress={openUrl}
          testID="next-button">
          Vamos lá
        </Button>
        <Button
          variant="outline"
          onPress={router.back}
          width="100%"
          mt={8}
          textAlign="center"
          borderColor="blue.500"
          _text={{ color: 'blue.500' }}>
          Completar depois
        </Button>
      </S.Container>
    </>
  );
};
