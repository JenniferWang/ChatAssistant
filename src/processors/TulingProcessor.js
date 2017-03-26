/*
 * @flow
 */

'use strict'

const request = require('request');
const {TULING} = require('../Config');

import type {Bot, Message, MessageProccesorContext} from '../Types';

function getTulingResponse(content: string, user: ?string): Promise<?string> {
  return new Promise((resolve, reject) => {
    const body = {
      userid: user || 'none',
      info: content,
      key: TULING.apiKey,
    };
    request.post(TULING.url, {form: body}, (error, response, body) => {
      if (error) {
        reject(error);
      }
      console.log('statusCode:', response && response.statusCode);
      resolve(JSON.parse(body).text);
    });
  });
}

function process(context: MessageProccesorContext): Promise<MessageProccesorContext> {
  const {bot, content, hasResponded, message} = context;
  const myName = bot.user.NickName;
  const isMentioned = !!content.match(`@${myName}`);
  if (!isMentioned || hasResponded) {
    return Promise.resolve(context);
  }
  const successContext = {
    ...context,
    hasResponded: true,
  };
  const onResponse = (response) => {
    if (!response) {
      return bot.sendMsg('~~~ 胸毛君听不懂🐱 ~~~~', message.FromUserName);
    } else {
      return bot.sendMsg(response, message.FromUserName);
    }
  };
  return getTulingResponse(content, myName)
    .then(onResponse)
    .then(() => successContext)
    .catch(() => context);
}

module.exports = {process};
