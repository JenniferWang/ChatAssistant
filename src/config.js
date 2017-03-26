/*
 * Provide some configurable constants
 */

module.exports = {
  TULING: {
    url: process.env.TU_LING_URL || 'http://www.tuling123.com/openapi/api',
    apiKey: process.env.TU_LING_KEY || '03f9e9175a9343fe8518a9e33d3ba60a',
    secret: process.env.TU_LING_SECRET || '',
  },
  MONGODB_HOST: 'mongodb://localhost/test',
  WECHAT: {
    login: 'https://login.weixin.qq.com/l/',
    qr: 'https://login.weixin.qq.com/qrcode/',
  },
  BUFFER_SIZE: 10,
};
