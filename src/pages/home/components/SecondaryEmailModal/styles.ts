import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  margin: 16px;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  color: #121a78;
  text-align: center;
  margin-top: 16px;
`;

export const ModalContent = styled.Text`
  font-size: 14px;
  color: #393939;
  margin-bottom: 6px;
`;

export const ButtonsContainer = styled.View`
  flex-direction: column;
  margin-top: auto;
  gap: 16px;
`;

export const DiscardText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1d2bc4;
  text-align: center;
  margin-bottom: 16px;
`;


