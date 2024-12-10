import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 16px;
`;
export const BottomContainer = styled.View`
  background-color: #fff;
  padding: 16px;
  margin-top: auto;
`;
export const InputContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 16px;
`;
export const Input = styled.TextInput<{ active?: boolean; error?: boolean }>`
  border-color: ${({ theme, active, error }) =>
    error ? theme.colors.red[550] : active ? theme.colors.blue[550] : 'rgba(0, 0, 0, 0.2)'};
  border-bottom-width: 2px;
  width: 15%;
  text-align: center;
  font-size: 20px;
`;
