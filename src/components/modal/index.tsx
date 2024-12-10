import { Button, Text } from 'native-base';

import * as S from './styles';
type Props = {
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  cancelTitle?: string;
  confirmTitle?: string;
  isLoading?: boolean;
};
export const Modal = ({
  onConfirm,
  onCancel,
  title,
  cancelTitle,
  confirmTitle,
  isLoading,
}: Props) => {
  return (
    <>
      <S.Container>
        <Text fontSize="md" mt={2} textAlign="center" color="black" testID="message-modal">
          {title}
        </Text>
        <Button
          bgColor="blue.500"
          width="100%"
          mt={8}
          textAlign="center"
          onPress={onConfirm}
          disabled={isLoading}
          isLoading={isLoading}>
          {confirmTitle}
        </Button>
        {cancelTitle && (
          <Button
            variant="outline"
            onPress={onCancel}
            width="100%"
            mt={8}
            textAlign="center"
            borderColor="blue.500"
            _text={{ color: 'blue.500' }}>
            {cancelTitle}
          </Button>
        )}
      </S.Container>
    </>
  );
};
