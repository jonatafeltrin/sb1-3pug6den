import 'detox';
import { sleep } from '../utils';

describe('Sign in screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  it('should redirect correctly to forgot password screen', async () => {
    await element(by.id('enter-button')).tap();
    await sleep(1000);
    await element(by.id('username')).clearText();
    await element(by.id('username')).typeText('passwordExpired@gmail.com');
    await device.pressBack();
    await element(by.id('password')).typeText('PortoBello@2026');
    await element(by.id('signin-button')).tap();
    await element(by.id('password-scroll')).scroll(100, 'down', NaN, 0.85);
    await element(by.id('password')).typeText('PortoBello@2024');
    await device.pressBack();
    await element(by.id('confirmPassword')).typeText('PortoBello@2024');
    await device.pressBack();

    await element(by.id('confirm-button')).tap();
  });
});
