/*
 * @flow
 */

'use strict'

const request = require('request');
const { BILIBILI_PROCESSOR } = require('../Config');

import type { MessageProccesorContext } from '../Types';

function process(context: MessageProccesorContext): Promise<MessageProccesorContext> {
  const { bot, content, hasResponded, message } = context;
  if (hasResponded) {
    return Promise.resolve(context);
  }
  const successContext = {
    ...context,
    hasResponded: true,
  };
  const matches = content.match('bilibili\.com\/video\/(av[0-9]+)(?:\/index\_([0-9]+))*');
  if (matches && matches.length > 2) {
    const av = matches[1];
    const index = matches[2];
    const response = index ?
      BILIBILI_PROCESSOR.getPrPrResponseWithIndex(av, index) :
      BILIBILI_PROCESSOR.getPrPrResponse(av);

    return bot.sendMsg(response, message.FromUserName)
      .then(() => successContext)
      .catch(() => context);
  }
  return Promise.resolve(context);
}

module.exports = { process };
