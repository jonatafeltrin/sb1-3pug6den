import { MaterialIcons } from '@expo/vector-icons';
import { Text } from 'native-base';
import styled, { useTheme } from 'styled-components/native';

type Props = {
  onPress?: () => void;
  children?: string;
};
const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;
export const Action = ({ onPress, children }: Props) => {
  const theme = useTheme();
  return (
    <Button onPress={onPress}>
      <Text fontSize={18} color="black">
        {children}
      </Text>
      <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.colors.blue['900']} />
    </Button>
  );
};
