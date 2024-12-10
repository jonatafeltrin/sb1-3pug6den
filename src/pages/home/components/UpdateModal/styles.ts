import UpdateImage from '@/assets/UpdateImage';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  margin: 16px;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

export const Banner = styled.View`
  background: #121a78;
  width: 100%;
  padding: 16px;
  margin-top: 16px;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
`;

export const BannerText = styled.Text`
  font-size: 20px;
  color: white;
`;

export const BannerImage = styled(UpdateImage)`
  flex: 1;
`;

export const BannerTextContainer = styled.View`
  flex-direction: column;
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  color: #121a78;
`;

export const ModalContent = styled.Text`
  font-size: 18px;
  color: #393939;
`;

export const ButtonsContainer = styled.View`
  flex-direction: column;
  margin-top: auto;
  gap: 20px;
`;

export const DiscardText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1d2bc4;
  text-align: center;
  margin-bottom: 16px;
`;

export const UpdateListContainer = styled.View``;

export const UpdateListItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 6px 16px;
  gap: 8px;
`;

export const UpdateListItemText = styled.Text`
  color: #1e1e1e;
  font-size: 14px;
`;
