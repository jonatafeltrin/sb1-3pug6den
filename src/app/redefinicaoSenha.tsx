import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from 'expo-router';
import { Heading, Text, VStack } from 'native-base';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextInput, View, StyleSheet } from 'react-native';
import * as yup from 'yup';

import { Button } from '../components/Button';
import { useAuth } from '../contexts/auth';

const schema = yup.object().shape({
  senha: yup
    .string()
    .required('A senha é obrigatória')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(/[a-z]/, 'A senha deve conter pelo menos 1 letra minúscula')
    .matches(/[A-Z]{2,}/, 'A senha deve conter pelo menos 2 letras maiúsculas')
    .matches(/\d/, 'A senha deve conter pelo menos 1 número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'A senha deve conter pelo menos 1 caractere especial'),
  confirmarSenha: yup
    .string()
    .required('A confirmação de senha é obrigatória')
    .oneOf([yup.ref('senha')], 'As senhas não coincidem'),
});

export default function Page() {
  const context = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    context.resetPassword(data.senha);
  };

  const [showRequirements, setShowRequirements] = useState(true);

  const senha = watch('senha', '');
  return (
    <View>
      <Stack.Screen
        options={{ title: 'Redefinição de senha', headerShown: true, headerBackTitle: '' }}
      />

      <VStack padding={4}>
        <Controller
          control={control}
          render={({ field }) => (
            <View>
              <Text style={styles.label}>Defina a nova senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Nova Senha"
                secureTextEntry
                onChangeText={(text) => field.onChange(text)}
                value={field.value}
                onFocus={() => setShowRequirements(false)}
              />
            </View>
          )}
          name="senha"
          rules={{
            required: 'A senha é obrigatória',
            minLength: {
              value: 8,
              message: 'A senha deve ter pelo menos 8 caracteres',
            },
            pattern: {
              value: /^(?=.*[A-Z].*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
              message:
                'A senha deve conter pelo menos 2 letras maiúsculas, 1 letra minúscula, 1 número e 1 caractere especial',
            },
          }}
        />
        {errors.senha && <Text>{errors.senha.message}</Text>}

        <Controller
          control={control}
          render={({ field }) => (
            <View>
              <Text style={styles.label}>Repita a nova senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Repetir Nova Senha"
                secureTextEntry
                onChangeText={(text) => field.onChange(text)}
                value={field.value}
              />
            </View>
          )}
          name="confirmarSenha"
          rules={{
            validate: (value) => value === senha || 'As senhas devem ser iguais',
          }}
        />
        {errors.confirmarSenha && <Text>{errors.confirmarSenha.message}</Text>}

        <VStack marginTop={4}>
          <Heading size="md">Sua senha deve ter</Heading>
          {showRequirements && (
            <View>
              <Text>Condições da senha:</Text>
              <Text style={{ color: 'green' }}>Pelo menos 1 letra minúscula</Text>
              <Text style={{ color: 'green' }}>Pelo menos 2 letras maiúsculas</Text>
              <Text style={{ color: 'green' }}>Pelo menos 1 número</Text>
              <Text style={{ color: 'green' }}>Pelo menos 1 caractere especial</Text>
            </View>
          )}
          {isDirty && (
            <View>
              <Text>Condições da senha:</Text>
              <Text style={{ color: schema.fields.senha.resolve('a') ? 'green' : 'red' }}>
                Pelo menos 1 letra minúscula
              </Text>
              <Text style={{ color: schema.fields.senha.resolve('a') ? 'green' : 'red' }}>
                Pelo menos 2 letras maiúsculas
              </Text>
              <Text style={{ color: schema.fields.senha.resolve('Aa1') ? 'green' : 'red' }}>
                Pelo menos 1 número
              </Text>
              <Text
                style={{
                  color: schema.fields.senha.resolve('Aa1!') ? 'green' : 'red',
                }}>
                Pelo menos 1 caractere especial
              </Text>
            </View>
          )}
        </VStack>
      </VStack>
      <Button text="Confirmar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
const styles = StyleSheet.create({
  label: {
    marginTop: 40,
    fontWeight: '300',
  },

  input: {
    width: '100%',
    borderBottomWidth: 1,
    paddingVertical: 15,
    borderColor: '#090D3D',
  },
});
