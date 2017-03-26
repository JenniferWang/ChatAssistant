/*
 * @flow
 */

'use strict'

import type {Bot, Message, MessageProccesorContext} from '../Types';

function process(context: MessageProccesorContext): Promise<MessageProccesorContext> {
  const {bot, content, hasResponded, message} = context;
  if (hasResponded) {
    return Promise.resolve(context);
  }
  const myName = bot.user.NickName;
  const isMentioned = !!content.match(`@${myName}`);
  const isCallingMe = !!content.match('胸毛');

  let response;
  if (isMentioned) {
    response = '~~~ 在下松井屋胸毛, 有何贵干喵🐱 ~~~';
  } else if (isCallingMe) {
    response = `~~~ 有人在呼唤我喵🐱 ~~~`
  } else {
    return Promise.resolve(context);
  }

  const successContext = {
    ...context,
    hasResponded: true,
  };
  return bot.sendMsg(response, message.FromUserName)
    .then(() => successContext)
    .catch(() => context);
}

module.exports = {process};
