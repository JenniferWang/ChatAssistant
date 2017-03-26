/*
 * @flow
 */

'use strict'

const request = require('request');
const {TULING} = require('../Config');

import type {Bot, Message, MessageProccesorContext} from '../Types'

function process(context: MessageProccesorContext): Promise<MessageProccesorContext>{
  const {bot, content, message, hasResponded, previousMessages} = context;
  const tags = content.match(/([^# ]+)/g);
  if (hasResponded || !tags || tags.length === 0) {
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
    response = `~~~ 胸毛君记下了喵🐱 ~~\ntag: ${tag}\n, note: ${note}\n`;
  }
  // fetch the previous message sent by the same user
  const previous = previousMessages && previousMessages.find(msg =>
    msg.FromUserName === message.FromUserName
  );
  if (previous) {
    note = previous.Content;
    response = `~~~ 胸毛君记下了喵🐱 ~~\ntags: ${JSON.stringify(tags)}\n, note: ${note}`;
  } else {
    response = '~~~ 胸毛君没有发现上文喵🐱 ~~~';
  }
  // asynchronously store to db

  return bot.sendMsg(response, message.FromUserName)
    .then(() => successContext)
    .catch(() => context);
}

module.exports = {process};
