import { API_BFF } from './api';

import { ApiRoutesEnum } from '@/enums';
const signin = <T>(data: T) => API_BFF.post(ApiRoutesEnum.SIGNIN, data);

const services = {
  signin,
};
export default services;
