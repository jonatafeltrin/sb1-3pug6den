// components/SharedForm.js
import { Feather } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { Text, InputGroup } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Recaptcha, { RecaptchaRef } from 'react-native-recaptcha-that-works';

import { Button } from './Button';

import { ENV } from '@/@constants';

export type FormDataProps = {
  username: string;
  password: string;
  recaptchaToken: string;
};

const SharedForm = ({ onSubmit }: any) => {
  const [hideCaracters, setHideCaracters] = useState<boolean>(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormDataProps>({
    defaultValues: { username: '', password: '' },
  });

  const recaptcha = useRef<RecaptchaRef | null>(null);

  const combinedValidator = (value: string) => {
    if (!value) {
      return 'Campo obrigatório';
    }

    const cpfRegex = /^\d{11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cpfRegex.test(value.replace(/\D/g, '')) && !emailRegex.test(value)) {
      return 'Formato de CPF ou e-mail inválido';
    }

    return true;
  };

  const handleTextShow = () => {
    setHideCaracters(!hideCaracters);
  };

  function onVerifyRecaptcha(token: string) {
    setValue('recaptchaToken', token);
    onSubmit({ ...getValues(), recaptchaToken: token });
  }

  function onSubmitForm(values: FormDataProps) {
    recaptcha.current?.open();
  }
  useEffect(() => {
    (async () => {
      const username = await SecureStore.getItemAsync('username');
      setValue('username', username!);
    })();
  }, []);
  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: 'Informe CPF ou E-mail',
          validate: combinedValidator,
        }}
        render={({ field }) => (
          <View removeClippedSubviews style={{ paddingHorizontal: 16, marginTop: 60 }}>
            <Text style={styles.label}>CPF ou e-mail</Text>
            <TextInput
              style={styles.input}
              onChangeText={field.onChange}
              testID="username"
              value={field.value}
              contextMenuHidden
            />
            <Text color="#E84C31" paddingLeft={4}>
              {errors.username?.message}
            </Text>
          </View>
        )}
        name="username"
      />

      <Controller
        control={control}
        render={({ field }) => (
          <View removeClippedSubviews style={{ padding: 16 }}>
            <Text style={styles.label}>Senha</Text>

            <InputGroup removeClippedSubviews>
              <TextInput
                secureTextEntry={hideCaracters}
                style={styles.input}
                onChangeText={field.onChange}
                testID="password"
                value={field.value}
                contextMenuHidden
              />
              <TouchableOpacity
                onPress={handleTextShow}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 48,
                  height: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Feather name={hideCaracters ? 'eye' : 'eye-off'} size={18} />
              </TouchableOpacity>
            </InputGroup>
          </View>
        )}
        name="password"
        rules={{ required: 'Este campo é obrigatório' }}
      />
      <View style={styles.button}>
        <Button
          text="Confirmar"
          onPress={handleSubmit(onSubmitForm)}
          title="Próximo"
          testID="signin-button"
        />
      </View>

      <Recaptcha
        ref={recaptcha}
        siteKey={ENV.SITE_KEY!}
        baseUrl={ENV.BASE_URL_CAPTCHA!}
        onVerify={onVerifyRecaptcha}
        size="invisible"
      />
    </View>
  );
};

export default SharedForm;

const styles = StyleSheet.create({
  label: {
    fontWeight: '300',
  },
  button: {
    marginTop: 32,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    paddingVertical: 15,
    borderColor: '#090D3D',
  },
});
