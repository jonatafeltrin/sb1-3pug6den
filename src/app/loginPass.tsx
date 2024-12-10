import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Text } from 'native-base';
import { ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';

import Header from '../components/Header';
import SharedForm, { FormDataProps } from '../components/sharedForm';
import { useAuth } from '../contexts/auth';

export default function Page({ route }: any) {
  const context = useAuth();

  const params = useLocalSearchParams();

  function handleSignIn(additionalData: FormDataProps) {
    const combinedData = { ...params, ...additionalData };
    const { username, password, recaptchaToken } = combinedData;

    if (!recaptchaToken) {
      Alert.alert('É necessário ter um captcha válido para continuar');
      return;
    }

    context.signIn(username, password, recaptchaToken);
  }

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <Stack.Screen options={{ title: 'login', headerShown: true, headerTitle: '' }} />
      <SafeAreaView style={styles.container}>
        <Header />
        <SharedForm onSubmit={handleSignIn} page="password" />

        <Link href="https://conta.portobello.com.br/account/acesso/esqueceu-senha">
          <Text color="#1D2BC4" fontWeight="600" textAlign="center">
            Não lembra da sua senha ?
          </Text>
        </Link>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 24,
    fontWeight: '300',
    color: '#090D3D',
  },

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

  button: {
    borderRadius: 6,
    margin: 16,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#2E3DE0',
    bottom: 0,
  },

  textButton: {
    color: '#fff',
  },
});
