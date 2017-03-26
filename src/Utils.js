/*
 * @flow
 */

'use strict';

import type { Bot, Message, MessageProccesorContext } from './Types';
const invariant = require('invariant');

function buildMessageContext(
  bot: Bot,
  message: Message,
  previousMessages: ?Array<Message>
): ?MessageProccesorContext {
  invariant(
    message.MsgType === bot.CONF.MSGTYPE_TEXT,
    'buildMessageContext: expected message type to be %s but get %s.',
    bot.CONF.MSGTYPE_TEXT,
    message.MsgType,
  );
  const matches = message.Content.match('^(.*):\\n(.*)');
  if (!matches || matches.length < 3) {
    console.log('....bad message format...' + message.Content);
  return null;
  }
  return {
    from: matches[1],
    content: matches[2],
    bot,
    message,
    previousMessages,
    hasResponded: false,
  };
}

module.exports = { buildMessageContext };
