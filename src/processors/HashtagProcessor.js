/*
 * @flow
 */

'use strict'

const request = require('request');
const { HASHTAG_PROCESSOR } = require('../Config');
const { getParsedMessage } = require('../Utils');

import type { MessageProccesorContext } from '../Types'

function process(context: MessageProccesorContext): Promise<MessageProccesorContext> {
  const { bot, from, content, message, previousMessages } = context;

  // TODO: Now we only 'store' the tags. Need to find a way to initiate 'search';
  const matches = content.match(/\#[^\# ]+/g);
  const tags = matches && matches.filter(t => t.length > 1); // '# '
  if (!tags || tags.length === 0) {
    return Promise.resolve(context);
  }
  const successContext = {
    ...context,
    hasResponded: true,
  };
  let note, response;
  if (tags.length === 1) {
    const tag = tags[0];
    note = content.split(tag).map(s => s.trim()).filter(s => s !== '').join('\n');
    if (note !== '') {
      response = HASHTAG_PROCESSOR.getTagRecordedResponse(tag, note || 'NONE');
    }
  }
  if (!note || !response) {
    // fetch the previous message sent by the same user
    const previous = previousMessages && previousMessages.find(prev => {
      if (prev.FromUserName !== message.FromUserName) {
        return false;
      }
      const parsed = getParsedMessage(prev);
      if (!parsed) {
        return false;
      }
      return parsed.from === from;
    });
    if (previous) {
      note = previous.Content;
      response = HASHTAG_PROCESSOR.getTagRecordedResponse(JSON.stringify(tags), note);
    } else {
      response = HASHTAG_PROCESSOR.getMissingPreviousMessageResponse(JSON.stringify(tags));
    }
  }
  // asynchronously store to db

  return bot.sendMsg(response, message.FromUserName)
    .then(() => successContext)
    .catch(() => context);
}

module.exports = { process };
