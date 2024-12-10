import 'detox';

describe('Sign in screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  it('should sign in correctly', async () => {
    await element(by.id('enter-button')).tap();
    await element(by.id('username')).clearText();
    await element(by.id('username')).typeText('hiyixi8357@sentrau.com ');
    await device.pressBack();
    await element(by.id('password')).typeText('PortoBello@2026');
    await device.pressBack();
    await element(by.id('signin-button')).tap();
    await waitFor(element(by.id('user-name')))
      .toHaveText('Olá, Fulano!')
      .withTimeout(10000);
  });
});
