import styled from 'styled-components/native';
export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
`;

export const Image = styled.Image`
  object-fit: cover;
  width: 100%;
  height: 85%;
  top: 0;
  position: absolute;
`;

export const Card = styled.View`
  background-color: #fff;
  align-content: center;
  padding: 16px;
  padding-bottom: 60px;
  margin-top: 50px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const CardText = styled.Text`
  font-size: 18px;
  font-weight: 400;
`;

export const Button = styled.TouchableOpacity`
  border-radius: 6px;
  margin-top: 16px;
  padding: 15px;
  align-items: center;
  background-color: #2e3de0;
  width: 100%;
`;

export const TextButton = styled.Text`
  color: #fff;
`;
