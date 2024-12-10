export const sleep = (milliseconds: number) => new Promise((res) => setTimeout(res, milliseconds));
export const signin = async () => {
  try {
    await element(by.id('enter-button')).tap();
    sleep(1000);
    await element(by.id('username')).clearText();
    await element(by.id('username')).typeText('hiyixi8357@sentrau.com');
    await device.pressBack();
    await element(by.id('password')).clearText();
    await element(by.id('password')).typeText('PortoBello@2026');
    await device.pressBack();
    await element(by.id('signin-button')).tap();
  } catch {}
};
