import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';

export const KeyBoardAvoidingContainer = ({
  children,
  keyboardVerticalOffset = 100,
}: {
  children: ReactNode;
  keyboardVerticalOffset?: number;
}) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#fff' }}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      {children}
    </KeyboardAvoidingView>
  </SafeAreaView>
);
