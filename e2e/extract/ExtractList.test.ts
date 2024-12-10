import { expect } from 'detox';
import { signin } from '../utils';

describe('Extract screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  it('should show the message correctly', async () => {
    await signin();
    await waitFor(element(by.id('user-name')))
      .toHaveText('Olá, Fulano!')
      .withTimeout(10000);
    await element(by.id('home-scroll')).scrollTo('bottom');
    await element(by.id('Extrato')).tap();
    await element(by.id('Acumulo')).tap();
    await waitFor(element(by.id('extract-message')))
      .toHaveText('Você não possui transações nos últimos 6 meses.')
      .withTimeout(5000);
  });
});
