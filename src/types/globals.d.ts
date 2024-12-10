declare type Option = {
  label: string;
  value: string;
};
declare type TError = {
  response: { data: { errors: { message: string }[] } };
};
declare type TOption = {
  label: string;
  id: string;
  url: string;
};
