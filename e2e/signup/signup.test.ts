import 'detox';

describe('Submit screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  it('should show signup correctly', async () => {
    await element(by.id('enter-button')).tap();
    await element(by.id('signup-tab')).tap();
    await element(by.id('name')).typeText('Fulano de tal');
    await device.pressBack();
    await element(by.id('cpf')).typeText('456.678.900-90');
    await device.pressBack();
    await element(by.id('birthdate')).typeText('19/12/1993');
    await device.pressBack();
    await element(by.id('phone')).typeText('55996542345');
    await device.pressBack();
    await element(by.id('email')).typeText('hiyixi8357@sentrau.com');
    await device.pressBack();
    await element(by.id('scroll')).scrollTo('bottom');
    await element(by.id('option_1')).tap();
    await element(by.id('option_2')).tap();
    await element(by.id('option_3')).tap();
    await element(by.id('next-button')).tap();
    await element(by.id('password')).typeText('PortoBello@2024');
    await device.pressBack();
    await element(by.id('confirmPassword')).typeText('PortoBello@2024');
    await device.pressBack();
    await element(by.id('confirm-button')).tap();
    await element(by.id('input_0')).typeText('1');
    await device.pressBack();
    await element(by.id('input_1')).typeText('2');
    await device.pressBack();
    await element(by.id('input_2')).typeText('3');
    await device.pressBack();
    await element(by.id('input_3')).typeText('4');
    await device.pressBack();
    await element(by.id('confirm-button')).tap();
    await waitFor(element(by.id('success-message')))
      .toHaveText('Tudo certo!')
      .withTimeout(3000);
    await element(by.id('ok-button')).tap();
  });
});
