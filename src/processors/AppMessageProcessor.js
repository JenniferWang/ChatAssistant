/*
 * @flow
 */

'use strict'

const BiliBiliProcessor = require('./BiliBiliProcessor');
const NetEaseMusicProcessor = require('./NetEaseMusicProcessor');
const { parseAppMessage } = require('../Utils');

import type { MessageProccesorContext } from '../Types'

function process(context: MessageProccesorContext): Promise<MessageProccesorContext> {
  const { bot, content, message } = context;
  const appMessage = parseAppMessage(content);
  if (!appMessage) {
    return Promise.resolve(context);
  }
  const {title, des, url} = appMessage.appMsg;
  const newContext = {
    ...context,
    content: url,
    metadata: {
      des,
      title,
    },
  };

  switch (appMessage.appName) {
    case '网易云音乐':
      return NetEaseMusicProcessor.process(newContext);
    case '哔哩哔哩动画':
      return BiliBiliProcessor.process(newContext);
    default:
      return Promise.resolve(context);
  }
}

module.exports = {process};
