import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: #0c1150;
  padding-top: 24px;
`;

export const InsideContainer = styled.View`
  margin-top: 40px;
`;
export const DateText = styled.Text`
  color: '#868686';
  font-weight: 400;
  font-style: italic;
  font-size: 12;
`;
export const DefaultText = styled.Text`
  color: '#4B4B4B';
  flex: 1;
  font-weight: 400;
`;
export const HeaderView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderIcons = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 35px;
  padding-right: 16px;
  gap: 4px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #fff;
  font-weight: 700;
  margin-top: 32px;
  margin-bottom: 28px;
  margin-left: 26px;
  text-transform: capitalize;
`;

export const Card = styled.View`
  background-color: #fff;
  margin-left: 16px;
  margin-right: 16px;
  padding: 16px;
  border-radius: 8px;
  gap: 4px;
  margin-bottom: -24px;
  border-width: 0.5px;
  border-color: #ddd;
`;
export const Icon = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
`;
