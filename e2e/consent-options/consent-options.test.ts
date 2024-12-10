import 'detox';
import { sleep } from '../utils';

describe('Sign in screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  it('should redirect correctly to the consent screen', async () => {
    await element(by.id('enter-button')).tap();
    await sleep(1000);
    await element(by.id('username')).clearText();
    await element(by.id('username')).typeText('fulano@gmail.com');
    await device.pressBack();
    await element(by.id('password')).typeText('PortoBello@2026');
    await element(by.id('signin-button')).tap();
    await sleep(1000);
    await element(by.id('option_3')).tap();
  });
});
