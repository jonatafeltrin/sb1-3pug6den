import AsyncStorage from '@react-native-async-storage/async-storage';

export async function AsyncStorageService(param) {
  return await AsyncStorage.getItem(param);
}
