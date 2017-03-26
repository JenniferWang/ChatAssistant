/*
 * Provide some configurable constants
 */

'use strict';

const compile = require('string-template/compile');

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

  // Processors
  DEFAULT_PROCESSOR: {
    getIsMentionedResponse: compile('~~~ 在下松井屋胸毛, 有何贵干喵🐱 ~~~'),
    getIsCalledResponse: compile('~~~ {0}在呼唤我喵🐱 ~~~'),
  },

  HASHTAG_PROCESSOR: {
    getTagRecordedResposne: compile('~~~ 胸毛君记下了喵🐱 ~~\ntags: {0}\n, note: {1}'),
    getMissingPreviousMessageResponse: compile('~~~ 胸毛君没有发现 {0} 上文喵🐱 ~~'),
  },
};
