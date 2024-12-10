import { router } from 'expo-router';

import { Container, Image, Card, CardText, Button, TextButton } from './styles';
import BackgroundImg from '../../assets/bg-login.png';

export default function Page() {
  return (
    <Container>
      <Image source={BackgroundImg} />

      <Card>
        <CardText>
          A Comunidade Portobello+Arquitetura é um espaço para os profissionais de arquitetura e
          designer exclusivo da Portobello Shop.
        </CardText>
        <Button onPress={() => router.push('/login')}>
          <TextButton testID="enter-button">Entrar</TextButton>
        </Button>
      </Card>
    </Container>
  );
}
