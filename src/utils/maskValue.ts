export const maskValue = (value: string) => {
  const numberValue = parseFloat(value);
  return isNaN(numberValue) ? '0' : numberValue.toLocaleString('pt-BR');
};

export const maskValueBRL = (value: number) => {
  if (value) {
    const valorFormatado = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return valorFormatado;
  }
};
