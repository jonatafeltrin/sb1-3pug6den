import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Text } from 'native-base';
import { useCallback, useState } from 'react';
import { Alert, TextInput } from 'react-native';

import * as S from './styles';

import { AppBar, KeyBoardAvoidingContainer } from '@/components';
import { useLoading } from '@/contexts/LoadingOverlay';
import { RoutesEnum } from '@/enums';
import { useTimer } from '@/hooks';
import { SignupService } from '@/services';

export const SignupVerify = () => {
  const { time, setTime } = useTimer();
  const params = useLocalSearchParams();
  const [hasError, setHasError] = useState(false);
  const resendCode = async () => {
    await SignupService.resendCode(params.email);
    setTime(180);
  };
  const { showLoading, hideLoading } = useLoading();
  const [key, setKey] = useState('');
  const onSubmit = async () => {
    setHasError(false);
    try {
      showLoading();
      await SignupService.verify({ key, idUser: params.idUser });
      router.replace(RoutesEnum.SIGNUP_SUCCESS);
    } catch (error) {
      const err = error as TError;
      setHasError(true);
      Alert.alert('Atenção', err?.response?.data?.errors?.[0]?.message);
    }
    hideLoading();
  };

  const [refs, setRefs] = useState<TextInput[]>(new Array(4).fill(''));
  const onKeyPress = useCallback(
    (keypress: string, index: number) => {
      if (keypress === 'Backspace') {
        refs[index - 1]?.focus();
        setKey((old) => old.slice(0, -1));
      } else {
        if (key.length === index) {
          setKey((old) => old.concat(keypress));
        }
        refs[index === 3 ? index : index + 1]?.focus();
      }
    },
    [key],
  );

  const onPaste = useCallback(() => {
    Clipboard.getStringAsync().then((content) => {
      if (content.length === 4 && !key.length) {
        setKey(content);
        Clipboard.setStringAsync('');
        refs[3]?.focus();
      }
      return content;
    });
  }, []);
  return (
    <KeyBoardAvoidingContainer keyboardVerticalOffset={80}>
      <S.Container>
        <AppBar>Código de verificação</AppBar>

        <Text fontSize="20px" color="blue.800" mb="24px">
          Para concluir o cadastro é necessário que você informe o código enviado para o seu e-mail
        </Text>
        <Text fontWeight={400} textAlign="center" marginTop="16px" color="grey.550">
          Código de segurança
        </Text>
        <S.InputContainer>
          {[0, 1, 2, 3].map((index) => (
            <S.Input
              autoFocus={index === 0}
              style={{ paddingVertical: 15 }}
              active={key.length > index}
              maxLength={1}
              onChange={onPaste}
              autoCapitalize="none"
              testID={`input_${index}`}
              error={hasError}
              key={index}
              ref={(ref: TextInput) => {
                setRefs((old) => {
                  old[index] = ref;
                  return old;
                });
              }}
              value={key[index]}
              onKeyPress={(e) => onKeyPress(e.nativeEvent.key, index)}
            />
          ))}
        </S.InputContainer>
        {hasError && (
          <Text fontWeight={400} textAlign="center" marginTop="4px" color="red.550">
            Código incorreto
          </Text>
        )}
        <Text
          color={time > 0 ? 'grey.550' : 'blue.600'}
          textAlign="center"
          fontSize={18}
          mt="48px"
          bold
          onPress={time > 0 ? undefined : resendCode}>
          {time > 0
            ? `Solicite um novo código em ${time} ${time === 1 ? 'segundo' : 'segundos'}`
            : 'Solicitar novo código'}
        </Text>
      </S.Container>
      <S.BottomContainer>
        <Button
          bgColor="blue.500"
          onPress={onSubmit}
          width="100%"
          marginTop="auto"
          marginBottom="16px"
          testID="confirm-button"
          textAlign="center">
          Confirmar
        </Button>
      </S.BottomContainer>
    </KeyBoardAvoidingContainer>
  );
};
