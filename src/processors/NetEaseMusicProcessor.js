/*
 * @flow
 */

'use strict'

const request = require('request');
const { NET_EASE_PROCESSOR } = require('../Config');

import type { MessageProccesorContext } from '../Types';

function process(context: MessageProccesorContext): Promise<MessageProccesorContext> {
  const { bot, content, hasResponded, message} = context;
  if (hasResponded) {
    return Promise.resolve(context);
  }
  const successContext = {
    ...context,
    hasResponded: true,
  };

  const matches = content.match('\/song\/([0-9]+)');
  if (matches && matches.length > 1) {
    const songId = matches[1];
    return bot.sendMsg(
        NET_EASE_PROCESSOR.getNetEaseResponse(songId),
        message.FromUserName
      )
      .then(() => successContext)
      .catch(() => context);;
  }
  return Promise.resolve(context);
}

module.exports = { process };
