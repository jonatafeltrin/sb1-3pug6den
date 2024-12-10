import styled, { css } from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
`;

export const TabsContainer = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

type TabProps = {
  isActive?: boolean;
};

export const Tab = styled.Text<TabProps>`
  ${({ isActive }) => css`
    text-align: center;
    padding: 16px;
    color: ${isActive ? '#090D3D' : '#727272'};
  `}
`;

export const TabContainer = styled.TouchableOpacity<TabProps>`
  ${({ isActive }) => css`
    flex: 1;
    border-bottom-width: 2px;
    border-color: ${isActive ? '#090D3D' : '#DDDDDD'};
  `}
`;
export const Form = styled.View`
  padding: 16px;
  gap: 32px;
`;
export const BottomContainer = styled.View`
  padding: 8px 16px;
  background-color: #fff;
`;
