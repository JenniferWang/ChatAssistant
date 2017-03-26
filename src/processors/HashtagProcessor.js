/*
 * @flow
 */

'use strict'

const request = require('request');
const { HASHTAG_PROCESSOR } = require('../Config');

import type {Bot, Message, MessageProccesorContext } from '../Types'

function process(context: MessageProccesorContext): Promise<MessageProccesorContext> {
  const { bot, content, message, previousMessages } = context;

  // TODO: Now we only 'store' the tags. Need to find a way to initiate 'search';
  const matches = content.match(/\#[^\# ]+/g);
  const tags = matches && matches.map(raw => raw.substring(1)).filter(t => t !== '');
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
    note = content.split(tag).filter(s => s !== '').join('\n');
    response = HASHTAG_PROCESSOR.getTagRecordedResposne(tag, note || 'NONE');
  }
  // fetch the previous message sent by the same user
  const previous = previousMessages && previousMessages.find(msg =>
    msg.FromUserName === message.FromUserName
  );
  if (previous) {
    note = previous.Content;
    response = HASHTAG_PROCESSOR.getTagRecordedResposne(JSON.stringify(tags), note);
  } else {
    response = HASHTAG_PROCESSOR.getMissingPreviousMessageResponse();
  }

  // asynchronously store to db

  return bot.sendMsg(response, message.FromUserName)
    .then(() => successContext)
    .catch(() => context);
}

module.exports = { process };
