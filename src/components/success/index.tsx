import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from 'native-base';
import { SafeAreaView, TouchableOpacity } from 'react-native';

import * as S from './styles';

import { AppBar } from '@/components';
import { CheckIconSecondary } from '@/custom-icons/checkIcon';

type Props = {
  onPress: () => void;
  buttonTitle?: string;
  title: string;
  header?: string;
};

export const Success = ({ onPress, buttonTitle, title, header = 'Tudo certo!' }: Props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar
        icon={
          <TouchableOpacity onPress={onPress}>
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
        <Text
          color="blue.950"
          fontSize={20}
          textAlign="center"
          bold
          mb="8px"
          testID="success-message">
          {header}
        </Text>
        <Text color="grey.500" fontSize={18} textAlign="center">
          {title}
        </Text>
        <Button
          bgColor="blue.500"
          width="100%"
          marginTop="auto"
          marginBottom="16px"
          testID="ok-button"
          textAlign="center"
          onPress={onPress}>
          {buttonTitle}
        </Button>
      </S.Container>
    </SafeAreaView>
  );
};
