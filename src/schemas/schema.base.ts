import moment from 'moment';
import * as Yup from 'yup';

const error = 'Este campo é obrigatório';
Yup.setLocale({
  mixed: {
    notType: error,
    default: error,
    required: error,
  },
  string: {
    email: 'E-mail inválido',
  },
});
type TPeriod = {
  min: { years: number };
  max: { years: number };
};
const dateRangeValidator = (
  context: Yup.StringSchema<string | undefined, Yup.Maybe<Yup.AnyObject>, undefined, ''>,
  period: TPeriod,
  message: string,
) => {
  const now = moment().startOf('day');
  const min = now.clone().add(period.min);
  const max = now.clone().add(period.max);
  return context.test('dateRange', message || 'A data não é válida', (date: string | undefined) => {
    const val = moment(date, 'DD/MM/YYYY');
    return val > min && val <= max;
  });
};
Yup.addMethod(Yup.string, 'birthdate', function (message: string) {
  return dateRangeValidator(
    this,
    {
      min: { years: -99 },
      max: { years: -18 },
    },
    message,
  );
});
Yup.addMethod(Yup.string, 'cpf', function () {
  return this.test('string', 'Por favor, insira um CPF válido', (value) => value!.length === 14);
});
Yup.addMethod(Yup.string, 'phone', function () {
  return this.test(
    'string',
    'Por favor, informe um número de telefone válido',
    (value) => value?.length === 14,
  );
});
