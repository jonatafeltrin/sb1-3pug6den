import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 16px;
`;
export const Action = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;
export const Tag = styled.View`
  background-color: ${({ theme }) => theme.colors.blue[950]};
  align-items: center;
  border-radius: 4px;
  width: 30%;
`;
export const Divider = styled.View`
  background-color: ${({ theme }) => theme.colors.gray[200]};
  height: 1px;
  width: 100%;
  margin: 16px 0;
`;
export const Box = styled.View`
  gap: 4px;
`;
