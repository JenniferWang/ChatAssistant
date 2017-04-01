/*
 * @flow
 */

'use strict';

import type {
  Bot,
  MessageProccesorContext,
  RawMessage,
} from './Types';

const invariant = require('invariant');

type Message = {
  from: ?string,
  content: string,
};

function getParsedMessage(message: RawMessage): Message {
  const matches = message.Content.match('^(.*):\\n(.*)');
  if (!matches || matches.length < 3) {
    return {
      from: null,
      content: message.Content,
    };
  }
  return {
    from: matches[1],
    content: matches[2],
  };
}

function buildMessageContext(
  bot: Bot,
  message: RawMessage,
  previousMessages: ?Array<RawMessage>
): ?MessageProccesorContext {
  if (
    message.MsgType !== bot.CONF.MSGTYPE_TEXT &&
    message.MsgType !== bot.CONF.MSGTYPE_APP
  ) {
    return null;
  }
  const parsedMessage = getParsedMessage(message);
  return {
    from: parsedMessage.from,
    content: parsedMessage.content,
    bot,
    message,
    previousMessages,
    hasResponded: false,
    metadata: null,
  };
}

/**
 * An prettified example 'AppMsg'
 *
 * <msg>
 * 	<appmsg appid="wx8dd6ecd81906fd84" sdkver="0">
 * 		<title>Take a bow</title>
 * 		<des>Rihanna</des>
 * 		<action></action>
 * 		<type>3</type>
 * 		<showtype>0</showtype>
 * 		<soundtype>0</soundtype>
 * 		<mediatagname></mediatagname>
 * 		<messageext></messageext>
 * 		<messageaction></messageaction>
 * 		<content></content>
 * 		<contentattr>0</contentattr>
 * 		<url>http://music.163.com/song/5148849?userid=335427992</url>
 * 		<lowurl>http://music.163.com/song/5148849?userid=335427992</lowurl>
 * 		<dataurl>http://music.163.com/song/media/outer/url?id=5148849</dataurl>
 * 		<lowdataurl>http://music.163.com/song/media/outer/url?id=5148849</lowdataurl>
 * 		<appattach>
 * 			<totallen>0</totallen>
 * 			<attachid></attachid>
 * 			<emoticonmd5></emoticonmd5>
 * 			<fileext></fileext>
 * 			<cdnthumburl>304a0201000443304102010002042b6fff6202030f52be020440ce69b8020458df32fb041f777869645f7639656538656c32656278623232385f313439313032323538360201000201000400</cdnthumburl>
 * 			<cdnthumbmd5>4e589155559e7475c5628ae0dd146d5f</cdnthumbmd5>
 * 			<cdnthumblength>5705</cdnthumblength>
 * 			<cdnthumbwidth>100</cdnthumbwidth>
 * 			<cdnthumbheight>100</cdnthumbheight>
 * 			<cdnthumbaeskey>145f39008354435da09be5ac4ed52aa5</cdnthumbaeskey>
 * 			<aeskey>145f39008354435da09be5ac4ed52aa5</aeskey>
 * 			<encryver>0</encryver>
 * 		</appattach>
 * 		<extinfo></extinfo>
 * 		<sourceusername></sourceusername>
 * 		<sourcedisplayname></sourcedisplayname>
 * 		<thumburl></thumburl>
 * 		<md5></md5>
 * 		<statextstr>GhQKEnd4OGRkNmVjZDgxOTA2ZmQ4NA==</statextstr>
 * 	</appmsg>
 * 	<fromusername>wxid_7mr05p7ld37s21</fromusername>
 * 	<scene>0</scene>
 * 	<appinfo>
 * 		<version>48</version>
 * 		<appname>网易云音乐</appname>
 * 	</appinfo>
 * 	<commenturl>
 * 	</commenturl>
 * </msg>
 */

// Export only useful info
export type AppMsg = {
  title: string,
  des: string,
  url: string,
};
export type AppMessage = {
  fromUser: string,
  appName: string,
  appMsg: AppMsg,
};

const re = new RegExp(
  '<title>(.*)<\/title>' +
  '<des>(.*)<\/des>' + '.*' +
  '<url>(.*)<\/url>' + '.*' +
  '<fromusername>(.*)<\/fromusername>' + '.*' +
  '<appname>(.*)<\/appname>'
);

function parseAppMessage(content: string): ?AppMessage {
  const matches = re.exec(content);
  if (matches && matches.length === 6) {
    const title = matches[1];
    const des = matches[2];
    const url = matches[3];
    const fromUser = matches[4];
    const appName = matches[5];

    const appMsg = {
      title,
      des,
      url,
    };
    return {
      fromUser,
      appName,
      appMsg,
    };
  }
  return null;
}

module.exports = {
  buildMessageContext,
  getParsedMessage,
  parseAppMessage,
};
