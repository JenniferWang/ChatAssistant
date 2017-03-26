'use strict';

jest.disableAutomock();

const { }

describe('HashtagProcessor', () => {
  let onlineBot;
  let offlineBot;
  beforeEach(() => {
    jest.resetModules();

    const ChatBot = require('ChatBot');

    onlineBot = new ChatBot(true);
    offlineBot = new ChatBot(false);
  });

  it('does not respond if there is no tag', async () => {
    const from = 'jennifer';
    const content = 'hello....';
    const message = {
      isSendBySelf: false,
      FromUserName: '@group',
      Content: `${from}:\n${content}`,
    };
    const context = {
      bot: onlineBot,
      from,
      content,
      message,
      hasResponded: false,
    };
    const { process } = require('../HashtagProcessor');
    const postContext = await process(context);
    expect(onlineBot.sendMsg).not.toBeCalled();
    expect(postContext.hasResponded).toBe(false);
  });

  it('process single tag within sentence', async () => {
    const contents = [
      '发现一颗旧糖 #w松井 http://www.bilibili.com/video/av2309992/',
      '#w松井 http://www.bilibili.com/video/av2309992/ ANN解禁',
      'http://www.bilibili.com/video/av2309992 旧糖 #w松井',
    ];
    const notes = [
      '发现一颗旧糖\nhttp://www.bilibili.com/video/av2309992/',
      'http://www.bilibili.com/video/av2309992/ ANN解禁',
      'http://www.bilibili.com/video/av2309992 旧糖',
    ];
    // TODO
  });
});
