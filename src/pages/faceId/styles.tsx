import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  ${({ theme }) => css`
    background-color: ${theme.colors.white};
  `}
`;

export const Content = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  ${({ theme }) => css`
    background-color: ${theme.colors.white};
  `}
`;
export const Footer = styled.View`
  justify-content: flex-end;
  padding-bottom: 16px;
`;
