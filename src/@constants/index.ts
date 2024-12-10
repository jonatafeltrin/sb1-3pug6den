import * as Updates from 'expo-updates';
import { RoutesEnum } from '@/enums';

const productionVariables = {
  SIGNUP_URL: 'https://maisarquitetura.portobello.com.br?activeTab=signup',
  CLIENT_ID: 'e93aa0c6-a768-4ed1-ba46-36ec793b9537',
  SECRET_ID: '19e69184-1a1b-43a6-a0c3-81b8d56e98e0',
  URL_TOKEN: 'https://api-portobello.sensedia.com/oauth/access-token',
  URL_TOKEN_API: 'https://api.portobello.com.br/plus-architecture-integration/bff_app',
  API_BFF_URL: 'https://api.portobello.com.br/plus-architecture-integration/bff',
  SITE_KEY: '6LdL2EwpAAAAAMgA64T2gj4fQVYwtbmeqeC0KTg6',
  BASE_URL_CAPTCHA: 'https://maisarquitetura.portobello.com.br',
  DELETE_ACCOUNT: 'https://conta.portobello.com.br/account/lgpd/exclusion',
  REQUEST_FORM_URL:
    'https://privacy-central.securiti.ai/#/dsr/80c2d823-aac4-48c8-97f2-c6b28e6dcbad',
  CATALOGO_URL: 'https://www.catalogomaisarquitetura.com.br/loginSSO/',
  PRIVACY_URL: 'https://www.portobello.com.br/conta/privacidade',
  TERMS_URL: 'https://www.portobello.com.br/conta/termos',
  RELATIONSHIP_URL: 'https://www.portobello.com.br/maisarquitetura/conta/regulamento',
  MAX_AGE: 86400000,
  RECOVERY_ACCOUNT_FORM_URL:
    'https://privacy-central.securiti.ai/#/dsr/80c2d823-aac4-48c8-97f2-c6b28e6dcbad',
  IOS_APP_URL: 'https://apps.apple.com/us/app/arquitetura/id6477121644',
  ANDROID_APP_URL: 'https://play.google.com/store/apps/details?id=com.portobello.maisarquitetura',
};

const defaultVariables = {
  ...productionVariables,
  CLIENT_ID: '3837468f-4951-4d55-a668-f09e2225bba4',
  SECRET_ID: 'df068fa7-8407-4d63-8fca-64df8a856ab0',
  URL_TOKEN: 'https://api-portobello.sensedia.com/qas/oauth/access-token',
  URL_TOKEN_API: 'https://api.portobello.com.br/qas/plus-architecture-integration/bff_app',
  API_BFF_URL: 'https://api.portobello.com.br/qas/plus-architecture-integration/bff',
  SITE_KEY: '6LdG2UwpAAAAAOFJ8S2QTtWWozjejm-qh2gXKgJO',
  CATALOGO_URL: 'https://catalogomaisarquitetura.omnion.com.br/loginSSO/',
};

export const ENV = Updates.channel !== 'production' ? productionVariables : productionVariables;

export const STATUSBAR_LIGHT_ROUTES = [
  RoutesEnum.PROFILE,
  RoutesEnum.HOME,
  RoutesEnum.INTRO,
  RoutesEnum.SIGNUP_MODAL,
];
