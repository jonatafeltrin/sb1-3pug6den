import { expect } from 'detox';
import { signin } from '../utils';

describe('Check-in screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  it('should show signup modal correctly', async () => {
    await signin();
    await element(by.id('home-scroll')).scrollTo('bottom');
    await element(by.id('check-in')).tap();
    await element(by.id('event-701')).tap();
    await element(by.id('next-button')).tap();
  });
});
