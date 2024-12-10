import { Stack } from 'expo-router';

import { ProfileFormProvider } from '@/contexts/ProfileFormContext';

export default function RootLayout() {
  return (
    <ProfileFormProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ProfileFormProvider>
  );
}
