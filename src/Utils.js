/*
 * @flow
 */

'use strict';

import type {
  Bot,
  MessageProccesorContext,
  RawMessage,
} from './Types';

const invariant = require('invariant');

type Message = {
  from: string,
  content: string,
};

function getParsedMessage(message: RawMessage): ?Message {
  const matches = message.Content.match('^(.*):\\n(.*)');
  if (!matches || matches.length < 3) {
    console.log('getParsedMessage: bad formatted message ' + message.Content);
    return null;
  }
  return {
    from: matches[1],
    content: matches[2],
  };
}

function buildMessageContext(
  bot: Bot,
  message: RawMessage,
  previousMessages: ?Array<RawMessage>
): ?MessageProccesorContext {
  invariant(
    message.MsgType === bot.CONF.MSGTYPE_TEXT,
    'buildMessageContext: expected message type to be %s but get %s.',
    bot.CONF.MSGTYPE_TEXT,
    message.MsgType,
  );
  const parsedMessage = getParsedMessage(message);
  if (!parsedMessage) {
    return null;
  }

  return {
    from: parsedMessage.from,
    content: parsedMessage.content,
    bot,
    message,
    previousMessages,
    hasResponded: false,
  };
}

module.exports = {
  buildMessageContext,
  getParsedMessage,
};
