import { StyleProp, ViewStyle } from 'react-native';

import { IStore } from '@/types/Store';

export type StoreItemProps = { item: IStore; styles: StyleProp<ViewStyle> };
