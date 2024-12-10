import { MaterialIcons } from '@expo/vector-icons';
import { Stack, Tabs, router } from 'expo-router';
import { ReactNode } from 'react';
import styled, { useTheme } from 'styled-components/native';

type Props = {
  children: string;
  variant?: 'secondary';
  icon?: ReactNode;
  headerRight?: ReactNode;
  headerShown?: boolean;
  headerLeft?: ReactNode;
  screen?: 'tab' | 'stack';
};
const Icon = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
  align-items: flex-start;
  justify-content: center;
`;

export const AppBar = ({
  children,
  variant,
  icon,
  headerRight,
  screen = 'stack',
  headerShown = true,
  headerLeft,
}: Props) => {
  const theme = useTheme();
  const Screen = screen === 'tab' ? Tabs.Screen : Stack.Screen;
  const getVariant = () => {
    switch (variant) {
      case 'secondary': {
        return {
          backgroundColor: theme.colors.blue[900],
          color: theme.colors.white,
        };
      }
      default: {
        return {
          backgroundColor: theme.colors.white,
          color: theme.colors.blue['900'],
        };
      }
    }
  };
  const variantStyle = getVariant();
  return (
    <Screen
      options={{
        title: children,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: variantStyle.backgroundColor },
        headerShown,
        headerTitleAlign: 'center',
        headerRight: () => headerRight,
        headerLeft: () =>
          headerLeft ?? (
            <Icon
              style={{ paddingLeft: screen === 'tab' ? 16 : 0 }}
              onPress={router.canGoBack() ? router.back : undefined}>
              {icon || <MaterialIcons name="arrow-back-ios" size={18} color={variantStyle.color} />}
            </Icon>
          ),
        headerTintColor: variantStyle.color,
      }}
    />
  );
};
