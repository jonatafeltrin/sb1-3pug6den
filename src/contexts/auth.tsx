import 'react-native-get-random-values';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useMMKV } from 'react-native-mmkv';

import { useLoading } from './LoadingOverlay';
import { IUser, IUserTemp } from './types/User';
import { API_BFF } from '../services/api';
import { useStorageState } from '../services/useStorageState';

import { ApiRoutesEnum, EXPO_PUSH_PERMISSION, RoutesEnum, StorageEnum } from '@/enums';
import { SigninService } from '@/services';
import { requestToken } from '@/services/tokenSensediaGenerator';
import { clearSession, setExpiresIn } from '@/utils';

import Constants from 'expo-constants';

interface AuthContextData {
  signIn(email?: string, senha?: string, recaptchaToken?: string): any;
  regenCode(recaptchaToken?: string): any;
  enableFaceId(): Promise<void>;
  user: IUser | null;
  userTemp: IUserTemp | null;
  ensureCompleteAccount(
    callback: () => void,
    key?: 'shouldCompleteAccountBeforeRedeem' | 'shouldCompleteAccountBeforeCheckin',
  ): () => void;
  location(data: Location.LocationObject): any;
  locationData: Location.LocationObject | null;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  resetPassword(password: string): any;
  getUser(): any;
  session: any;
  isLoading: boolean;
  signOut: any;
}

export const AuthContext = createContext({} as AuthContextData);

const AuthProvider = ({ children }: any) => {
  const [[isLoading, session], setSession] = useStorageState('session');
  const { showLoading, hideLoading } = useLoading();
  const [user, setUser] = useState(null);
  const [userTemp, setUserTemp] = useState(null);
  const [userNameTemp, setUserNameTemp] = useState('');
  const [locationData, setLocation] = useState<Location.LocationObject | null>(null);
  const [senhaTemp, setSenha] = useState('');
  const [idUser, setIdUser] = useState('');
  const storage = useMMKV();

  useEffect(() => {
    async function fetchUser() {
      requestToken();
      const user = await SecureStore.getItemAsync('user');
      if (user) {
        setUser(JSON.parse(user));
      }
    }
    fetchUser();
  }, []);

  const enableFaceId = async () => {
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert('Face ID não está configurado no dispositivo.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      fallbackLabel: 'Utilizar senha',
      disableDeviceFallback: true,
    });

    if (result.success) {
      await SecureStore.setItemAsync(StorageEnum.ALLOWED_FACE_ID, 'true');
      Alert.alert('Sucesso', 'Face ID ativado com sucesso!');
    } else {
      Alert.alert('Erro', 'Não foi possível ativar o Face ID.');
    }
  };

  const signIn = async (email?: string, senha?: string, recaptchaToken?: string) => {
    if (email && senha) {
      setUserNameTemp(email);
      setSenha(senha);
    }

    showLoading();

    try {
      const isIos = Platform.OS === 'ios';
      const deviceID = isIos ? await Application.getIosIdForVendorAsync() : '';

      const { status } = await Notifications.getPermissionsAsync().catch(() => ({
        status: 'failed',
      }));

      const data: Record<string, any> = {
        username: email ? email : userNameTemp,
        password: senha ? senha : senhaTemp,
        recaptchaToken,
      };

      if (status === EXPO_PUSH_PERMISSION.GRANTED) {
        SecureStore.setItemAsync(StorageEnum.ACCEPTED_NOTIFICATIONS, EXPO_PUSH_PERMISSION.GRANTED);
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        await Notifications.getExpoPushTokenAsync({
          projectId,
        }).then((response) => {
          data.expoPushToken = response.data;
        }).catch(() => {});
      } else {
        SecureStore.setItemAsync(StorageEnum.ACCEPTED_NOTIFICATIONS, EXPO_PUSH_PERMISSION.DENIED);
      }

      const response = await SigninService.signin(isIos ? { ...data, deviceID } : data);

      setIdUser(response.data.profile.id);

      await Promise.all([
        SecureStore.setItemAsync('user', JSON.stringify(response.data)),
        SecureStore.setItemAsync('username', email!),
        SecureStore.setItemAsync(
          StorageEnum.LATEST_RUNTIME_VERSION,
          response.data.latestRuntimeVersion,
        ),
        SecureStore.setItemAsync(
          StorageEnum.LATEST_UPDATES,
          JSON.stringify(response.data.latestUpdates),
        ),
      ]);

      setUserTemp(response.data);
      setUser(response.data);
      hideLoading();

      const allowedFaceId = storage.getBoolean(StorageEnum.ALLOWED_FACE_ID);
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled && allowedFaceId && isIos) {
        router.push(RoutesEnum.FACE_ID_MODAL);
        return;
      }
      if (isEnrolled && isIos && allowedFaceId) {
        await LocalAuthentication.authenticateAsync({
          fallbackLabel: '',
          disableDeviceFallback: true,
        });
      }

      await setExpiresIn();
      router.replace(RoutesEnum.HOME);
    } catch (err: any) {
      hideLoading();
      Alert.alert('Alerta', err.response?.data.errors[0].message, [
        { text: 'OK', onPress: () => {} },
      ]);
    }
  };

  const regenCode = async (recaptchaToken?: string) => {
    showLoading();

    try {
      const response = await API_BFF.post(ApiRoutesEnum.SIGNIN, {
        username: userNameTemp,
        password: senhaTemp,
        recaptchaToken,
      });
      hideLoading();
      setIdUser(response.data.profile.id);
      setUserTemp(response.data);
      await SecureStore.setItemAsync('user', JSON.stringify(response.data));
    } catch (err: any) {
      hideLoading();
      Alert.alert('Alerta', err.response?.data.errors[0].message, [
        { text: 'OK', onPress: () => {} },
      ]);
    }
  };

  const resetPassword = async (pass: any) => {
    API_BFF.put(ApiRoutesEnum.RESET_PASSWORD, {
      password: pass,
      idUser: user?.profile?.id,
      key: user?.profile?.key,
    })
      .then(async (res) => {
        setUser(res.data);
        await SecureStore.setItemAsync('user', JSON.stringify(res.data));
        router.push(RoutesEnum.HOME);
      })
      .catch((err) => {
        Alert.alert('Alerta', err.response.data.errors[0].message, [
          { text: 'OK', onPress: () => {} },
        ]);
      });
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    await clearSession();
  };

  const getUser = async () => {
    return await SecureStore.getItemAsync('user');
  };

  const location = async (data: Location.LocationObject) => {
    setLocation(data);
  };

  function ensureCompleteAccount(
    callback: () => void,
    key:
      | 'shouldCompleteAccountBeforeRedeem'
      | 'shouldCompleteAccountBeforeCheckin' = 'shouldCompleteAccountBeforeCheckin',
  ) {
    return () => {
      if (user?.profile?.[key]) {
        router.push({ pathname: RoutesEnum.SIGNUP_MODAL, params: { key } });
        return undefined;
      }
      return callback();
    };
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        enableFaceId,
        ensureCompleteAccount,
        regenCode,
        location,
        session,
        setUser,
        isLoading,
        resetPassword,
        getUser,
        locationData,
        signOut,
        userTemp,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
