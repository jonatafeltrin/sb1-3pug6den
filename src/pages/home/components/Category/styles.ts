import styled from 'styled-components/native';

export const BarGreyLine = styled.View`
  border-top-width: 6px;
  border-color: #ddd;
  margin-top: 12px;
  width: 100%;
`;

export const BarGreenLine = styled.View<{ width: number }>`
  border-top-width: 6px;
  border-color: #6ed8aa;
  margin-top: 12px;
  width: ${(props) => props.width}%;
  z-index: 2;
  position: absolute;
  left: 0;
`;

export const Bar = styled.View<{ background?: string }>`
  height: 6px;
  flex: 1;
  background-color: ${(props) => (props.background ? props.background : '#333')};
`;

export const Card = styled.View`
  background-color: #fff;
  margin-left: 16px;
  margin-right: 16px;
  padding: 16px;
  border-radius: 8px;
  gap: 4px;
  margin-top: 34px;
  border-width: 0.5px;
  border-color: #ddd;
`;
