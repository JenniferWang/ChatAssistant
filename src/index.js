/*
 * @flow
 */

'use strict';

require('babel-register');

const Wechat = require('wechat4u');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const request = require('request');

const FILE_HELPER = 'filehelper';
const {
  BUFFER_SIZE,
  ERROR,
  LOGIN,
  LOGOUT,
  UUID,
  MESSAGE,
} = require('./Config');
const Buffer = require('./Buffer');

const buffer = new Buffer(BUFFER_SIZE);
const bot = new Wechat();
bot.start()

const onError = (error) => {
  bot.emit(ERROR, error);
}

/* ------------- message processer ------------- */

function processTag(tag: string, notes: string) {
}

function getTextMessageResponse(content: string): Promise<?string> {
  const user = bot.user.NickName;
  const isMentioned = content.match(`@${user}`);
  let fromUser = '';

  let matches = content.match('^(.*):\\n.*');
  if (matches && matches.length > 1) {
    fromUser = matches[1];
  }
  if (isMentioned) {
    matches = content.match('#(.*) (.*)');
    if (matches && matches.length > 2) {
      const tag = matches[1];
      const notes = matches[2];
      processTag(tag, notes);
      return Promise.resolve(`~~~ 胸毛君记下了喵🐱 ~~~`);
    }
    return Promise.resolve(`~~~ 在下松井屋胸毛, 有何贵干喵🐱 ~~~~`);
  }

  if(content.match('胸毛')) {
    return Promise.resolve(`~~~ ${fromUser} 有人在呼唤我喵🐱 ~~~`);
  }
  return Promise.resolve(null);
}

/* ------------- events ------------- */

bot.on(UUID, uuid => {
  qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
    small: true
  })
  console.log('QR code:', 'https://login.weixin.qq.com/qrcode/' + uuid)
});

bot.on(LOGIN, () => {
  console.log('Login succeeded.');
});

bot.on(LOGOUT, () => {
  console.log('Logout');
});

bot.on(ERROR, err => {
  console.log('Erro: ', err);
})

bot.on(MESSAGE, msg => {
  console.log('received message from ', msg.FromUserName);
  console.log(msg);
  let ToUserName = FILE_HELPER;
  switch (msg.MsgType) {
    case bot.CONF.MSGTYPE_TEXT:
      getTextMessageResponse(msg.Content).then(response => {
        if (response) {
          bot.sendMsg(response, msg.FromUserName);
        }
      }).catch(onError);
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
