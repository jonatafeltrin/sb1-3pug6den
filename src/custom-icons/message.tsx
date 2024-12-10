import { Circle, Path, Svg } from 'react-native-svg';
export const MessageIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill="#090D3D" />
    <Path
      d="M15.5 32C15.1 32 14.75 31.85 14.45 31.55C14.15 31.25 14 30.9 14 30.5V17.5C14 17.1 14.15 16.75 14.45 16.45C14.75 16.15 15.1 16 15.5 16H32.5C32.9 16 33.25 16.15 33.55 16.45C33.85 16.75 34 17.1 34 17.5V30.5C34 30.9 33.85 31.25 33.55 31.55C33.25 31.85 32.9 32 32.5 32H15.5ZM24 24.45L15.5 18.875V30.5H32.5V18.875L24 24.45ZM24 22.95L32.4 17.5H15.625L24 22.95ZM15.5 18.875V17.5V30.5V18.875Z"
      fill="#FCF9F3"
    />
  </Svg>
);