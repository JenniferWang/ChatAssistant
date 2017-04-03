/*
 * @flow
 */

'use strict'

const request = require('request');

const Store = require('../Store');
const { HASHTAG_PROCESSOR } = require('../Config');
const { getParsedMessage } = require('../Utils');

import type { MessageProccesorContext } from '../Types'

function process(context: MessageProccesorContext): Promise<MessageProccesorContext> {
  const { bot, from, content, message, previousMessages } = context;

  const tagMatches = content.match(/\#[^\# ]+/g);
  const tags = tagMatches && tagMatches.filter(t => t.length > 1); // '# '
  if (!tags || tags.length === 0) {
    return Promise.resolve(context);
  }

  const successContext = {
    ...context,
    hasResponded: true,
  };

  // There is no better way to find an identifier for chat groups
  const key = bot.contacts[message.FromUserName].getDisplayName();

  const processSearch = () => {
    if (tags.length > 1) {
      return bot.sendMsg(
        HASHTAG_PROCESSOR.getTooManyTagsForSearchResponse(),
        message.FromUserName
      )
      .then(() => successContext)
      .catch(() => context);
    }

    return Store.searchNoteByTag(key, tags[0])
      .then(docs => docs.map((doc, idx) => `[${idx}] ${doc.content}`).join('\n'))
      .then(stringified => bot.sendMsg(
        HASHTAG_PROCESSOR.getSearchSuccessResponse(stringified),
        message.FromUserName
      ))
      .then(() => successContext)
      .catch(() => context);
  }

  const processClear = () => {
    if (tags.length > 1) {
      return bot.sendMsg(
        HASHTAG_PROCESSOR.getTooManyTagsForSearchResponse(),
        message.FromUserName
      )
      .then(() => successContext)
      .catch(() => context);
    }
    return Store.clearTag(key, tags[0])
      .then(() => bot.sendMsg(
        HASHTAG_PROCESSOR.getClearSuccessResponse(tags[0]),
        message.FromUserName,
      ))
      .then(() => successContext)
      .catch(() => context);
  }

  const processSave = () => {
    if (tags.length === 1) {
      const tag = tags[0];
      note = content.split(tag).map(s => s.trim()).filter(s => s !== '').join('\n');
      if (note !== '') {
        response = HASHTAG_PROCESSOR.getTagRecordedResponse(tag, note || 'NONE');
      }
    }
    if (!note || !response) {
      // fetch the previous message sent by the same user
      console.log('current FromUserName', message.FromUserName);
      console.log('previous messages', previousMessages);
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
      console.log()
      if (previous) {
        note = previous.Content;
        response = HASHTAG_PROCESSOR.getTagRecordedResponse(JSON.stringify(tags), note);
      } else {
        response = HASHTAG_PROCESSOR.getMissingPreviousMessageResponse(JSON.stringify(tags));
      }
    }

    if (note) {
      Store.writeNote(key, note, tags);
    }

    return bot.sendMsg(response, message.FromUserName)
      .then(() => successContext)
      .catch(() => context);
  }

  let note, response;
  const searchModeMatches = content.match(/^[查|找|搜]+/g);
  if (searchModeMatches && searchModeMatches.length > 0) {
    return processSearch();
  }

  const clearModeMatches = content.match(/^[清|删][理|除|空]/g);
  if (clearModeMatches && clearModeMatches.length > 0) {
    return processClear();
  }

  return processSave();
}

module.exports = { process };
