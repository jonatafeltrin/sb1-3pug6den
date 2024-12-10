import 'detox';
import { signin, sleep } from '../utils';

describe('Notification screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  it('should view notification correctly', async () => {
    await signin();
    await sleep(1000);
    await element(by.id('notification-icon')).tap();
    await sleep(1000);
    await element(by.id('notification-1')).tap();
    await element(by.id('next-button')).tap();
  });
});
