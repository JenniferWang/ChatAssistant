/*
 * @flow
 */

'use strict';

require('babel-register');

const qrcode = require('qrcode-terminal');
const fs = require('fs');

const {
  BUFFER_SIZE,
  TULING,
  WECHAT,
} = require('./Config');
const Buffer = require('./Buffer');
const ChatBot = require('./ChatBot');
const { buildMessageContext } = require('./Utils');

import type { Bot, MessageProccesor } from './Types';

const FILE_HELPER = 'filehelper';

// Note: order matters.
const _textMessageProcessors: Array<MessageProccesor> = [
  require('./processors/HashtagProcessor'),
  require('./processors/BiliBiliProcessor'),
  require('./processors/TulingProcessor'),
  require('./processors/DefaultProcessor'),
];

const _appMessageProcessor: MessageProccesor = require('./processors/AppMessageProcessor');

// const _buffer = new Buffer(BUFFER_SIZE);
const _buffer = [];
const bot: Bot = new ChatBot();
bot.start()

const onError = (error) => {
  bot.emit('error', error);
}

/* ------------- events ------------- */
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
  let ToUserName = FILE_HELPER;
  if (msg.isSendBySelf) {
    return;
  }
  if (_buffer.length > BUFFER_SIZE) {
    _buffer.pop();
  }
  const initialContext = buildMessageContext(bot, msg, _buffer.slice()/* 'concurrency' */);
  if (!initialContext) {
    return;
  }
  let postContext = null;
  switch (msg.MsgType) {
    case bot.CONF.MSGTYPE_TEXT:
      postContext = _textMessageProcessors.reduce((prevPromise, processor) => {
        return prevPromise.then(processor.process);
      }, Promise.resolve(initialContext));
      break
    case bot.CONF.MSGTYPE_APP:
      postContext = _appMessageProcessor.process(initialContext);
      break
    default:
      break
  }
  if (postContext) {
    postContext.then(context => {
      msg.Content = `${context.from || ''}:\n${context.content}`;
      _buffer.unshift(msg);
    });
  } else {
    _buffer.unshift(msg);
  }
});
