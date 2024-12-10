export enum ExtractTypes {
  RECEIVED = '1',
  RESCUED = '2',
  EXPIRED = '3',
  CHECKIN = '4',
  RE = '5',
  CANCELED = '6',
}

export enum ExtractFilterTypes {
  CHECKIN = 'CHECKIN',
  RESGATES = 'RESGATES',
  EXPIRADO = 'EXPIRADO',
  // COM_RE = 'COM_RE',
  BONUS = 'BONUS',
  RECEBIDO = 'RECEBIDO',
  CANCELADO = 'CANCELADO',
}

export const actionFilterMessages: Record<ExtractFilterTypes, string> = {
  [ExtractFilterTypes.CHECKIN]: 'Check-in',
  [ExtractFilterTypes.RESGATES]: 'Resgate de pontos',
  [ExtractFilterTypes.EXPIRADO]: 'Pontos expirados',
  [ExtractFilterTypes.RECEBIDO]: 'Pontos recebidos',
  // [ExtractFilterTypes.COM_RE]: 'Remuneração do Especificador',
  [ExtractFilterTypes.BONUS]: 'Bônus campanha',
  [ExtractFilterTypes.CANCELADO]: 'Cancelados',
};

export const actionMessages: Record<ExtractTypes, string> = {
  [ExtractTypes.RE]: 'Remuneração do Especificador',
  [ExtractTypes.RECEIVED]: 'Acumulo P. Faturado',
  [ExtractTypes.RESCUED]: 'Resgate',
  [ExtractTypes.EXPIRED]: 'Pontos expirados',
  [ExtractTypes.CHECKIN]: 'Check-in',
  [ExtractTypes.CANCELED]: 'Cancelados',
};

export const filterTypeOptions = [
  {
    label: 'Tudo',
    value: undefined,
  },
  // {
  //   label: 'Com RE',
  //   value: ExtractFilterTypes.COM_RE,
  // },
  {
    label: 'Recebidos',
    value: ExtractFilterTypes.RECEBIDO,
  },
  {
    label: 'Resgates',
    value: ExtractFilterTypes.RESGATES,
  },
  {
    label: 'Check-in',
    value: ExtractFilterTypes.CHECKIN,
  },
  {
    label: 'Expirados',
    value: ExtractFilterTypes.EXPIRADO,
  },
  {
    label: 'Cancelados',
    value: ExtractFilterTypes.CANCELADO,
  },
  {
    label: 'Bônus',
    value: ExtractFilterTypes.BONUS,
  },
];
export enum StatusTransaction {
  RECEBIDO = 'RECEBIDO',
  ENVIADO = 'ENVIADO',
  CANCELADA = 'CANCELADA',
  CANCELADO = 'CANCELADO',
}

export interface IExtractContentResponse {
  id: string;
  document: string;
  date: string;
  to_expire_date?: string;
  isReceived?: string;
  transactionCode: string;
  transactionDescription: string;
  action?: string;
  filter: string;
  point: number;
  invoiceNumber: string;
  documentStore: string;
  dateToExpire?: string;
  nameStore?: string;
  dateInvoice: string;
  transactionTypeCode?: string;
  transactionTypeDescription?: string;
  transactionStatus?: string;
  transactionSales?: TranscationSalesDto;
  transactionCheckin?: TranscationCheckinDto;
  transactionReward?: TranscationRewardDto;
}

export interface UseTransactionDetailsParams {
  itemToShowDetails: IExtractContentResponse;
  receivedRE: boolean;
  isUpdatingRE: boolean;
  updateStatusRE: (document: string, numberOrder: string, specifierRE: boolean) => Promise<boolean>;
  resumeCategory: string;
}
export interface IGetExtractResumeDto {
  document: string;
  name: string;
  email: string;
  category: string;
  valueToNextCategory: number;
  pointsToExpire: number;
  acceptCommunication: boolean;
  balance: number;
  convergenceTaxPercentual?: number;
  toNextCategory: number;
  nextCategory: string;
  toExpireValue?: string;
  toExpireDate?: string;
  purchaseFrequencyValue: number;
  valueQuantityCheckins: number;
  valueQuantityCheckinsInEvent: number;
  valueQuantityClientsDiff: number;
  valueQuantityCheckinsLastMonth: number;
  dateRegulationAcceptance: string;
  regulationAcceptance: boolean;
}
export interface IExtractResponse {
  resume: IGetExtractResumeDto;
  content: IExtractContentResponse[];
  toExpirePoints: IToExpirePoints[];
}

export interface IToExpirePoints {
  id: string;
  document?: string;
  date: string;
  points?: number;
  status?: string;
}

interface TranscationSalesDto {
  documentStore: string;
  documentCostumer: string;
  nameCostumer: string;
  numberOrder: string;
  typeInvoice: string;
  valueOrder: number;
  isSpecifierRE: boolean;
  statusSendSales: string;
}
interface TranscationCheckinDto {
  documentStore: string;
  eventIDSalesforce?: string;
  dateCheckin: string;
  eventCodeSalesforce?: string;
  statusCheckin?: string;
  eventName?: string;
}
interface TranscationRewardDto {
  transactionID: string;
  productID: string;
  description: string;
  quantity: number;
  points: number;
  status: string;
  balance: number;
  pointsGrantedAfterTransaction: number;
  bonusPointsAfterTransaction: number;
  rewardPointsAfterTransaction: number;
  pointExpiredAfterTransaction: number;
}

export interface ExtractBody {
  document: string;
  date_start?: string;
  date_end?: string;
}

export interface UpdateStatusRE {
  document: string;
  numberOrder: string;
  specifierRE: boolean;
}

export enum ExtractCheckinStatus {
  CONCLUIDO = 'Concluído',
  PROCESSANDO = 'Processando',
}

export enum ExtractSalesStatus {
  APROVADO = 'Aprovado',
  EM_APROVACAO = 'Aguardando faturamento',
  CANCELADO = 'Cancelado',
}

export enum FilterExtractTypes {
  NEWEST = 'Mais recentes',
  DATEPICKER = 'Personalizar',
  LATEST = 'Mais antigos',
}

export const FilterExtractOptions = [
  {
    label: 'Mais recentes',
    value: FilterExtractTypes.NEWEST,
  },
  {
    label: 'Personalizar',
    value: FilterExtractTypes.DATEPICKER,
  },
  {
    label: 'Mais antigos',
    value: FilterExtractTypes.LATEST,
  },
];
