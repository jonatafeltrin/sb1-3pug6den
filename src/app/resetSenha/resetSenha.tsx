import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

import {
  Container,
  Input,
  Label,
  Button,
  TextButton,
  TextDescription,
  Title,
  TextBack,
} from './styles';

import { useLoading } from '@/contexts/LoadingOverlay';
import { ApiRoutesEnum } from '@/enums';
import { API_BFF } from '@/services/api';

const ResetSenha = () => {
  const [email, setEmail] = useState('');
  const { showLoading, hideLoading } = useLoading();

  const handleEmail = async () => {
    showLoading();
    try {
      await API_BFF.put(ApiRoutesEnum.FORGOT_PASSWORD, { email });
      hideLoading();
      Alert.alert('Enviado com sucesso.', 'Verifique seu e-mail.');
    } catch (err: any) {
      Alert.alert('Alerta', err.response.data.errors[0].message);
      hideLoading();
    }
  };

  return (
    <Container>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerShown: true,
          headerTintColor: '#090D3D',
          headerShadowVisible: false,
        }}
      />
      <View>
        <Title>Redefinição de senha</Title>
        <TextDescription>
          Digite o endereço de e-mail da sua Conta Portobello que enviaremos uma mensagem com link
          para redefinição de senha.
        </TextDescription>
        <Label>Email</Label>
        <Input onChangeText={setEmail} autoCapitalize="none" />
      </View>
      <Button onPress={handleEmail}>
        <TextButton>Continuar</TextButton>
      </Button>
      <TextBack onPress={() => router.back()}>Voltar para login</TextBack>
    </Container>
  );
};

export default ResetSenha;
