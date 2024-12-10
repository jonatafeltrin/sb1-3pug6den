import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  ${({ theme }) => css`
    background-color: ${theme.colors.white};
  `}
`;
export const Header = styled.View`
  height: 156px;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  ${({ theme }) => css`
    background-color: ${theme.colors.blue[900]};
  `}
`;
export const AccounContainer = styled.View`
  flex: 1;
  padding-top: 16px;
  ${({ theme }) => css`
    background-color: ${theme.colors.white};
  `}
`;
