/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts =
  process.env.APP_MODE === 'mocked'
    ? ['mock.ts', 'mock.tsx', ...config.resolver.sourceExts, 'svg']
    : [...config.resolver.sourceExts, 'svg'];

config.transformer.getTransformOptions = () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
