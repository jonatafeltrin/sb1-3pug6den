import Feather from '@expo/vector-icons/Feather';

import { IExtractContentResponse, IGetExtractResumeDto, IToExpirePoints } from '@/types/Extract';

export type FeatherIconName = keyof typeof Feather.glyphMap;

export type TCategory = {
  balance?: string;
  convergence_tax_percentual?: string;
  current_category?: string;
  next_category?: string;
  to_expire_date?: string;
  to_expire_value?: string;
  to_next_category?: string;
  to_next_category_frequency?: string;
};

export type TInvoice = {
  toNextCategory?: number;
  current?: number;
};

export type TOrders = {
  toNextCategory?: number;
  current?: number;
};

export type TStatistic = {
  invoice?: TInvoice;
  orders?: TOrders;
};

export interface ICategory {
  category?: TCategory;
  statistic?: TStatistic;
}

export interface IExtractItem {
  item: IExtractContentResponse;
  onUpdateItemSpecifierRE?: (data: any) => void;
  onPress?: () => void;
  resume?: IGetExtractResumeDto;
  toExpirePoints?: IToExpirePoints[];
  category?: ICategory;
}

export enum TransactionStatus {
  PROCESSANDO = 'Processando',
  AGUARDANDO_FATURAMENTO = 'Aguardando Faturamento',
  CONCLUIDO = 'Concluído',
  FATURADO = 'Faturado',
  FATURADO_TOTALMENTE = 'Faturado totalmente',
  CANCELADO = 'Cancelado',
}

export interface StatusDetails {
  iconName: FeatherIconName;
  iconColor: string;
  additionalText: string;
  statusTextColor: string;
  pointsTextColor: string;
  isNegative: boolean;
}

export const statusDetailsMap: Record<string, StatusDetails> = {
  [TransactionStatus.PROCESSANDO]: {
    iconName: 'alert-circle',
    iconColor: '#E9D7B4',
    additionalText: 'Processando',
    statusTextColor: '#1E1E1E',
    pointsTextColor: '#1E1E1E',
    isNegative: false,
  },
  [TransactionStatus.AGUARDANDO_FATURAMENTO]: {
    iconName: 'alert-circle',
    iconColor: '#E9D7B4',
    additionalText: 'Aguardando Faturamento',
    statusTextColor: '#1E1E1E',
    pointsTextColor: '#1E1E1E',
    isNegative: false,
  },
  [TransactionStatus.CONCLUIDO]: {
    iconName: 'check-circle',
    iconColor: '#30B47A',
    additionalText: 'Concluído',
    statusTextColor: '#30B47A',
    pointsTextColor: '#30B47A',
    isNegative: false,
  },
  [TransactionStatus.FATURADO]: {
    iconName: 'check-circle',
    iconColor: '#30B47A',
    additionalText: 'Faturado',
    statusTextColor: '#30B47A',
    pointsTextColor: '#30B47A',
    isNegative: false,
  },
  [TransactionStatus.FATURADO_TOTALMENTE]: {
    iconName: 'check-circle',
    iconColor: '#30B47A',
    additionalText: 'Faturado totalmente',
    statusTextColor: '#30B47A',
    pointsTextColor: '#30B47A',
    isNegative: false,
  },
  [TransactionStatus.CANCELADO]: {
    iconName: 'x-circle',
    iconColor: '#E84C31',
    additionalText: 'Cancelado',
    statusTextColor: '#E84C31',
    pointsTextColor: '#E84C31',
    isNegative: true,
  },
};
