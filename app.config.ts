import { ExpoConfig, ConfigContext } from 'expo/config';

const version = process.env.VERSION;
const buildNumber = process.env.BUILD_NUMBER;
const versionCode = process.env.VERSION_CODE ? parseInt(process.env.VERSION_CODE as string) : null;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  version: version ?? config?.version,
  ios: {
    ...config.ios,
    buildNumber: buildNumber ?? config?.ios?.buildNumber,
  },
  android: {
    ...config.android,
    versionCode: versionCode ?? config?.android?.versionCode,
  },
});
