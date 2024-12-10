import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export const handleDownloadAndShare = async (path: string, name: string) => {
  try {
    if (path) {
      const pdfUri = Asset.fromModule(path).uri;
      const tempDir = `${FileSystem.cacheDirectory}downloads/`;
      await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
      const destinationUri = `${tempDir}${name}.pdf`;

      await FileSystem.downloadAsync(pdfUri, destinationUri);

      await Sharing.shareAsync(destinationUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Baixar PDF',
      });
    } else {
      Alert.alert('Alerta', 'Houve um erro ao processar o arquivo');
    }
  } catch {
    Alert.alert('Alerta', 'Houve um erro ao processar o arquivo');
  }
};
