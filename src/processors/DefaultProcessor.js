/*
 * @flow
 */

'use strict';

const { DEFAULT_PROCESSOR } = require('../Config');

import type { MessageProccesorContext } from '../Types';

function process(context: MessageProccesorContext): Promise<MessageProccesorContext> {
  const { bot, content, from, hasResponded, message } = context;
  if (hasResponded) {
    return Promise.resolve(context);
  }
  const myName = bot.user.NickName;
  const isMentioned = !!content.match(`@${myName}`);
  const isCallingMe = !!content.match('胸毛');

  let response;
  if (isMentioned) {
    response = DEFAULT_PROCESSOR.getIsMentionedResponse();
  } else if (isCallingMe) {
    response = DEFAULT_PROCESSOR.getIsCalledResponse(from);
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

module.exports = { process };
