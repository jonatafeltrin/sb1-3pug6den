const BufferFunction = require('buffer').Buffer;

function transformFromHexToUtf(value: string) {
  return BufferFunction.from(value, 'hex').toString('utf8');
}

function transformFromUtfToHex(value: string) {
  return BufferFunction.from(value, 'utf8').toString('hex');
}

export default {
  transformFromHexToUtf,
  transformFromUtfToHex,
};
