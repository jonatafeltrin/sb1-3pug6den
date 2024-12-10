import { Link, router } from 'expo-router';
import { CheckIcon, Heading, Text, VStack } from 'native-base';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

export default function Modal() {
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
      }}>
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      {!isPresented && <Link href="../">Dismiss</Link>}
      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}

      <View
        style={{
          marginTop: 200,
          width: '100%',
          backgroundColor: '#525EE5',
          padding: 8,
          borderRadius: 40,
          width: 74,
          height: 74,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CheckIcon style={{ color: '#fff', width: 20, height: 20 }} />
      </View>
      <VStack
        width="100%"
        padding={4}
        alignItems="center"
        justifyContent="space-between"
        flexDirection="column"
        flex={1}
        marginBottom={6}>
        <VStack alignItems="center">
          <Heading>Check-in</Heading>
          <Text>Check-in registrado</Text>
        </VStack>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
          <Text style={{ color: '#fff' }}>Voltar para a home</Text>
        </TouchableOpacity>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2E3DE0',
    padding: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
});
