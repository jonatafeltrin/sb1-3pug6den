import { Circle, Path, Svg, SvgProps } from 'react-native-svg';

export const StarIcon = ({ fill }: SvgProps) => (
  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="16" fill={fill} />
    <Path
      d="M12.7292 21.7292L16 19.7708L19.2708 21.75L18.3958 18.0417L21.2708 15.5417L17.4792 15.2083L16 11.7083L14.5208 15.1875L10.7292 15.5208L13.6042 18.0208L12.7292 21.7292ZM10.8542 24.3333L12.2083 18.4792L7.66666 14.5417L13.6667 14.0208L16 8.5L18.3333 14.0208L24.3333 14.5417L19.7917 18.4792L21.1458 24.3333L16 21.2292L10.8542 24.3333Z"
      fill="#090D3D"
    />
  </Svg>
);
