/*
 * @flow
 */

'use strict';

require('babel-register');


const Wechat = require('wechat4u');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const request = require('request');

const {
  BUFFER_SIZE,
  TULING,
  WECHAT,
} = require('./Config');
const Buffer = require('./Buffer');
const {buildMessageContext} = require('./Utils');

import type {
  Message,
  MessageProccesor,
  Contact,
  Bot,
} from './Types';

const FILE_HELPER = 'filehelper';

// Note: order matters.
const processors: Array<MessageProccesor> = [
  require('./processors/BiliBiliProcessor'),
  require('./processors/HashtagProcessor'),
  require('./processors/TulingProcessor'),
  require('./processors/DefaultProcessor'),
];

const buffer = new Buffer(BUFFER_SIZE);
const bot: Bot = new Wechat();
bot.start()

const onError = (error) => {
  bot.emit('error', error);
}

/* ------------- events ------------- */
// TODO: assume we only process message coming from other people.

bot.on('uuid', uuid => {
  qrcode.generate(WECHAT.login + uuid, {
    small: true
  })
  console.log('QR code:', WECHAT.qr + uuid);
});

bot.on('login', () => {
  console.log('Login succeeded.');
});

bot.on('logout', () => {
  console.log('Logout');
});

bot.on('error', err => {
  console.log('Erro: ', err);
})

bot.on('message', msg => {
  if (msg.isSendBySelf) {
    return;
  }
  let ToUserName = FILE_HELPER;
  switch (msg.MsgType) {
    case bot.CONF.MSGTYPE_TEXT:
      const initialContext = buildMessageContext(bot, msg);
      if (initialContext) {
        processors.reduce((prevPromise, processor) => {
          return prevPromise.then(processor.process);
        }, Promise.resolve(initialContext));
      }
      break
    case bot.CONF.MSGTYPE_APP:
      buffer.push(msg);
      bot.forwardMsg(msg, ToUserName)
        .catch(onError);
      break
    default:
      buffer.push(msg);
      break
  }
});
