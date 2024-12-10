import 'styled-components';
import { THEME } from '../theme';

type CustomTheme = typeof THEME;

declare module 'styled-components/native' {
  export interface DefaultTheme extends CustomTheme {}
}
