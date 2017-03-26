'use strict';

const user = {
  UserName: '@12345',
  NickName: 'Meow',
};

function DefaultBot(connected) {
  this.user = user;
  this.contacts = {};

  this.sendMsg = jest.fn((text, to) => {
    if (connected) {
      return Promise.resolve();
    }
    return Promise.reject('ChatBot: bot cannot send message now');
  });
}

module.exports = DefaultBot;
