/*
 * @flow
 */

'use strict'

const request = require('request');
const {TULING} = require('../Config');

import type {Bot, Message, MessageProccesorContext} from '../Types';

function process(context: MessageProccesorContext): Promise<MessageProccesorContext> {
  const {bot, content, hasResponded, message} = context;
  const successContext = {
    ...context,
    hasResponded: true,
  };
  const matches = content.match('bilibili\.com\/video\/(av[0-9]+)\/(index\_([0-9]+))*');
  if (matches && matches.length > 1) {
    const av = matches[1];
    // const index = matches.length > 3 ? matches[3] : null;
    return bot.sendMsg(`~~~~ 喵🐱, 快来舔 ${av} ~~~~`, message.FromUserName)
      .then(() => successContext)
      .catch(() => context);
  }
  return Promise.resolve(context);
}

module.exports = {process};
