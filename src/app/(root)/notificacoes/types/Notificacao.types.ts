export enum NotificationTypes {
  TUDO = 'Tudo',
  NAO_LIDA = 'Não lidas',
  LIDA = 'Lidas',
  ARQUIVADA = 'Arquivadas',
  DESTAQUE = 'Destaque',
}

export enum EnumBFF {
  TUDO = 'TUDO',
  NAO_LIDA = 'NAO_LIDA',
  LIDA = 'LIDA',
  ARQUIVADA = 'ARQUIVADA',
  DESTAQUE = 'DESTAQUE',
  EXCLUIDO = 'EXCLUIDO',
}

export interface IData {
  id: string;
  title: string;
  message: string;
  document: string;
  processType: string;
  redirectTo?: string;
  status: string;
  date: Date;
  expirationDate: Date;
}
