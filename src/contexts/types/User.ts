export interface IUser {
  result: string;
  profile: Profile;
  required_consent: [];
}

interface Profile {
  id: string;
  name: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  email: string;
  email_verified: true;
  picture: string;
  birthdate: string;
  cpf: string;
  mobile: string;
  address: string;
  addressNumber: string;
  addressComplement: string;
  city: string;
  state: string;
  neighborhood: string;
  cep: string;
  access_token: string;
  key: string;
  storeInvite?: string;
  shouldCompleteAccountBeforeRedeem?: boolean;
  shouldCompleteAccountBeforeCheckin?: boolean;
}

export interface IUserTemp {
  profile: Profile;
}
interface Profile {
  email: string;
  mobilePhone: string;
}
