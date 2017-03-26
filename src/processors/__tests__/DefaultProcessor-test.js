'use strict';

jest.disableAutomock();

const { DEFAULT_PROCESSOR } = require('../../Config');

describe('DefaultProcessor', () => {
  let onlineBot;
  let offlineBot;
  beforeEach(() => {
    jest.resetModules();

    const ChatBot = require('ChatBot');

    onlineBot = new ChatBot(true);
    offlineBot = new ChatBot(false);
  });

  it('respond if is mentioned', async () => {
    const from = 'jennifer';
    const content = `hello @${onlineBot.user.NickName}....`;
    const message = {
      isSendBySelf: false,
      FromUserName: '@group',
      Content: `${from}:\n${content}`,
    };
    const sharedContext = {
      from,
      content,
      message,
      hasResponded: false,
    };
    const { process } = require('../DefaultProcessor');
    let postContext = await process({
      ...sharedContext,
      bot: onlineBot,
    });
    expect(onlineBot.sendMsg).toBeCalledWith(
      DEFAULT_PROCESSOR.getIsMentionedResponse(),
      message.FromUserName
    );
    expect(postContext.hasResponded).toBe(true);

    postContext = await process({
      ...sharedContext,
      bot: offlineBot,
    });
    expect(offlineBot.sendMsg).toBeCalled();
    expect(postContext.hasResponded).toBe(false);
  });

  it('respond if is called', async () => {
    const from = 'jennifer';
    const content = `胸毛君超可爱的`;
    const message = {
      isSendBySelf: false,
      FromUserName: '@group',
      Content: `${from}:\n${content}`,
    };
    const sharedContext = {
      from,
      content,
      message,
      hasResponded: false,
    };
    const { process } = require('../DefaultProcessor');
    let postContext = await process({
      ...sharedContext,
      bot: onlineBot,
    });
    expect(onlineBot.sendMsg).toBeCalledWith(
      DEFAULT_PROCESSOR.getIsCalledResponse(from),
      message.FromUserName
    );
    expect(postContext.hasResponded).toBe(true);

    postContext = await process({
      ...sharedContext,
      bot: offlineBot,
    });
    expect(offlineBot.sendMsg).toBeCalled();
    expect(postContext.hasResponded).toBe(false);
  });

  it('does not respond if `hasResponded` in previous context is true.', async () => {
    const from = 'jennifer';
    const content = `胸毛君超可爱的`;
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
      hasResponded: true,
    };

    const { process } = require('../DefaultProcessor');
    await process(context);
    expect(onlineBot.sendMsg).not.toBeCalled();
  });
})
