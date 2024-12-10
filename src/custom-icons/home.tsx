import { Circle, ClipPath, Defs, G, Path, Rect, Svg, SvgProps } from 'react-native-svg';

export const HomeIcon = ({ fill }: SvgProps) => (
  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    {fill && <Circle cx="16" cy="16" r="16" fill={fill} />}
    <G clipPath="url(#clip0_80411_71)">
      <Path
        d="M14.3334 22.6667V17.6667H17.6667V22.6667H21.8334V16H24.3334L16 8.5L7.66669 16H10.1667V22.6667H14.3334Z"
        fill="#090D3D"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_80411_71">
        <Rect width="20" height="20" fill="white" transform="translate(6 6)" />
      </ClipPath>
    </Defs>
  </Svg>
);
