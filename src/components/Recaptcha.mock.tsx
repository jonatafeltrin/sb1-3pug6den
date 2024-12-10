import { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

export const Recaptcha = forwardRef((props: { onVerify: (t: string) => void }, ref) => {
  useImperativeHandle(ref, () => ({
    open: () => props.onVerify('token'),
  }));
  return <View />;
});
