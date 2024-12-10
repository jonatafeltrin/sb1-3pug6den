import * as React from 'react';
import Svg, { Rect, Path, SvgProps } from 'react-native-svg';

function CheckStatus(props: SvgProps) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none" {...props}>
      <Rect width={12} height={12} rx={6} fill="#30B47A" />
      <Path
        d="M4.725 8.926l-2.8-2.8.537-.538 2.263 2.263 4.8-4.8.537.537-5.337 5.338z"
        fill="#fff"
      />
    </Svg>
  );
}

export default CheckStatus;
