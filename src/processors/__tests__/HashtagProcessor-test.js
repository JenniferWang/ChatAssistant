'use strict';

jest.disableAutomock();

const { HASHTAG_PROCESSOR } = require('../../Config');
const { process } = require('../HashtagProcessor');

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
    const postContext = await process(context);
    expect(onlineBot.sendMsg).not.toBeCalled();
    expect(postContext.hasResponded).toBe(false);
  });

  describe('processes single tag within sentence', () => {
    const from = 'jennifer';
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

    for (let ii = 0; ii < contents.length; ii++) {
      it(`sends correct response for [${ii}]`, async() => {
        const message = {
          isSendBySelf: false,
          FromUserName: '@group',
          Content: `${from}:\n${contents[ii]}`,
        };
        const context = {
          bot: onlineBot,
          from,
          content: contents[ii],
          message,
          hasResponded: false,
        };
        await process(context);
        expect(onlineBot.sendMsg).toBeCalledWith(
          HASHTAG_PROCESSOR.getTagRecordedResponse('#w松井', notes[ii]),
          message.FromUserName,
        );
      });
    }
  });

  it('processes multiple tags with previous messages', async () => {
    const from = 'jennifer';
    const content = ' #松鼠  #w松井 #女王优 ';
    const expectedTags = ['#松鼠', '#w松井', '#女王优'];
    const expectedNote = `${from}:\nhttp://www.bilibili.com/video/av8789608/`;
    const previousMessages = [
      {
        isSendBySelf: true,
        FromUserName: '@group1',
        Content: `${onlineBot.user.NickName}:\n喵🐱`,
      },
      {
        isSendBySelf: false,
        FromUserName: '@group2',
        Content: `玉子:\n啊，玲奈酱好帅。2333`,
      },
      {
        isSendBySelf: false,
        FromUserName: '@group1',
        Content: expectedNote,
      },
      {
        isSendBySelf: false,
        FromUserName: '@group1',
        Content: 'foo:\n 233333.',
      }
    ];
    const message = {
      isSendBySelf: false,
      FromUserName: '@group1',
      Content: `${from}:\n${content}`,
    };
    const context = {
      bot: onlineBot,
      hasResponded: false,
      from,
      content,
      message,
      previousMessages,
    };
    await process(context);
    expect(onlineBot.sendMsg).toBeCalledWith(
      HASHTAG_PROCESSOR.getTagRecordedResponse(JSON.stringify(expectedTags), expectedNote),
      message.FromUserName,
    );
  })

  it('processes multiple tags without previous messages', async () => {
    const from = 'jennifer';
    const content = ' #松鼠  #w松井 #女王优 ';
    const expectedTags = ['#松鼠', '#w松井', '#女王优'];
    const message = {
      isSendBySelf: false,
      FromUserName: '@group',
      Content: `${from}:\n${content}`,
    };
    let context = {
      bot: onlineBot,
      from,
      content,
      message,
    };
    await process(context);
    expect(onlineBot.sendMsg).toBeCalledWith(
      HASHTAG_PROCESSOR.getMissingPreviousMessageResponse(JSON.stringify(expectedTags)),
      message.FromUserName,
    );
  });

});
