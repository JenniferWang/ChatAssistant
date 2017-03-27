/*
 * @flow
 */

'use strict';

export type User = {
  UserName: string,
  NickName: string,
};

export type RawMessage = {
  MsgType: MessageType,
  isSendBySelf: boolean,
  FromUserName: string,
  ToUserName: string,
  Content: string, // it has another field 'OriginalContent'

  isSendBy: (constact: Contact) => boolean,
  getPeerUserName: () => string,
  getDisplayTime: () => string,
};

export type MessageProccesorContext = {
  // wechat bot instance
  bot: Bot,
  // indicates whether the previous processor has made a response.
  hasResponded: boolean,
  // nick name of the sender.
  from: ?string,
  // message stripped of the 'prefix'
  content: string,
  // current 'Message' object.
  message: RawMessage,
  // previous messages provide context. [newest msg, ..., oldest msg]
  previousMessages: ?Array<RawMessage>,
};

export type MessageProccesor = {
  process: (context: MessageProccesorContext) => Promise<MessageProccesorContext>,
};

export type Contact = {
  getDisplayName: () => string,
  getUserByUserName: (name: string) => ?Contact,
  getSearchUser: (keyword: string) => Array<Contact>,
  isSelf: (contact: Contact) => boolean,
  isRoomContact: (contact: Contact) => boolean,
  isPublicContact: (constact: Contact) => boolean,
  isSpContact: (Contact: Contact) => boolean,
};

export type CallBack = (data: any) => void;
export type Event = 'error' | 'login' | 'logout' | 'uuid' | 'message';
export type Bot = {
  start: () => void,
  stop: () => void,
  emit: (event: Event, data: any) => void,
  on: (event: Event, callback: CallBack) => void,
  forwardMsg: (message: RawMessage, to: string) => Promise<void>,
  sendMsg: (text: string, to: string) => Promise<void>,

  CONF: BotConfig,
  state: BotState, // bot.CONF.STATE
  user: User,       // current login user
  contacts: { [username: string]: Contact },
};

export type BotState = {
  init: 'init',
  uuid: 'uuid',
  login: 'login',
  logout: 'logout',
};

export type MessageType = {
  MSGTYPE_TEXT: number,
  MSGTYPE_IMAGE: number,
  MSGTYPE_VOICE: number,
  MSGTYPE_VIDEO: number,
  MSGTYPE_MICROVIDEO: number,
  MSGTYPE_EMOTICON: number,
  MSGTYPE_APP: number,
  MSGTYPE_VOIPMSG: number,
  MSGTYPE_VOIPNOTIFY: number,
  MSGTYPE_VOIPINVITE: number,
  MSGTYPE_LOCATION: number,
  MSGTYPE_STATUSNOTIFY: number,
  MSGTYPE_SYSNOTICE: number,
  MSGTYPE_POSSIBLEFRIEND_MSG: number,
  MSGTYPE_VERIFYMSG: number,
  MSGTYPE_SHARECARD: number,
  MSGTYPE_SYS: number,
  MSGTYPE_RECALLED: number,
};

export type BotConfig = MessageType & {
  CONTACTFLAG_CONTACT: number,
  CONTACTFLAG_CHATCONTACT: number,
  CONTACTFLAG_CHATROOMCONTACT: number,
  CONTACTFLAG_BLACKLISTCONTACT: number,
  CONTACTFLAG_DOMAINCONTACT: number,
  CONTACTFLAG_HIDECONTACT: number,
  CONTACTFLAG_FAVOURCONTACT: number,
  CONTACTFLAG_3RDAPPCONTACT: number,
  CONTACTFLAG_SNSBLACKLISTCONTACT: number,
  CONTACTFLAG_NOTIFYCLOSECONTACT: number,
  CONTACTFLAG_TOPCONTACT: number,
  MM_USERATTRVERIFYFALG_BIZ: number,
  MM_USERATTRVERIFYFALG_FAMOUS: number,
  MM_USERATTRVERIFYFALG_BIZ_BIG: number,
  MM_USERATTRVERIFYFALG_BIZ_BRAND: number,
  MM_USERATTRVERIFYFALG_BIZ_VERIFIED: number,
  MM_DATA_TEXT: number,
  MM_DATA_HTML: number,
  MM_DATA_IMG: number,
  MM_DATA_PRIVATEMSG_TEXT: number,
  MM_DATA_PRIVATEMSG_HTML: number,
  MM_DATA_PRIVATEMSG_IMG: number,
  MM_DATA_VOICEMSG: number,
  MM_DATA_PUSHMAIL: number,
  MM_DATA_QMSG: number,
  MM_DATA_VERIFYMSG: number,
  MM_DATA_PUSHSYSTEMMSG: number,
  MM_DATA_QQLIXIANMSG_IMG: number,
  MM_DATA_POSSIBLEFRIEND_MSG: number,
  MM_DATA_SHARECARD: number,
  MM_DATA_VIDEO: number,
  MM_DATA_VIDEO_IPHONE_EXPORT: number,
  MM_DATA_EMOJI: number,
  MM_DATA_LOCATION: number,
  MM_DATA_APPMSG: number,
  MM_DATA_VOIPMSG: number,
  MM_DATA_STATUSNOTIFY: number,
  MM_DATA_VOIPNOTIFY: number,
  MM_DATA_VOIPINVITE: number,
  MM_DATA_MICROVIDEO: number,
  MM_DATA_SYSNOTICE: number,
  MM_DATA_SYS: number,
  MM_DATA_RECALLED: number,
  MSG_SEND_STATUS_READY: number,
  MSG_SEND_STATUS_SENDING: number,
  MSG_SEND_STATUS_SUCC: number,
  MSG_SEND_STATUS_FAIL: number,
  APPMSGTYPE_TEXT: number,
  APPMSGTYPE_IMG: number,
  APPMSGTYPE_AUDIO: number,
  APPMSGTYPE_VIDEO: number,
  APPMSGTYPE_URL: number,
  APPMSGTYPE_ATTACH: number,
  APPMSGTYPE_OPEN: number,
  APPMSGTYPE_EMOJI: number,
  APPMSGTYPE_VOICE_REMIND: number,
  APPMSGTYPE_SCAN_GOOD: number,
  APPMSGTYPE_GOOD: number,
  APPMSGTYPE_EMOTION: number,
  APPMSGTYPE_CARD_TICKET: number,
  APPMSGTYPE_REALTIME_SHARE_LOCATION: number,
  APPMSGTYPE_TRANSFERS: number,
  APPMSGTYPE_RED_ENVELOPES: number,
  APPMSGTYPE_READER_TYPE: number,
  UPLOAD_MEDIA_TYPE_IMAGE: number,
  UPLOAD_MEDIA_TYPE_VIDEO: number,
  UPLOAD_MEDIA_TYPE_AUDIO: number,
  UPLOAD_MEDIA_TYPE_ATTACHMENT: number,
  PROFILE_BITFLAG_NOCHANGE: number,
  PROFILE_BITFLAG_CHANGE: number,
  CHATROOM_NOTIFY_OPEN: number,
  CHATROOM_NOTIFY_CLOSE: number,
  StatusNotifyCode_READED: number,
  StatusNotifyCode_ENTER_SESSION: number,
  StatusNotifyCode_INITED: number,
  StatusNotifyCode_SYNC_CONV: number,
  StatusNotifyCode_QUIT_SESSION: number,
  VERIFYUSER_OPCODE_ADDCONTACT: number,
  VERIFYUSER_OPCODE_SENDREQUEST: number,
  VERIFYUSER_OPCODE_VERIFYOK: number,
  VERIFYUSER_OPCODE_VERIFYREJECT: number,
  VERIFYUSER_OPCODE_SENDERREPLY: number,
  VERIFYUSER_OPCODE_RECVERREPLY: number,
  ADDSCENE_PF_QQ: number,
  ADDSCENE_PF_EMAIL: number,
  ADDSCENE_PF_CONTACT: number,
  ADDSCENE_PF_WEIXIN: number,
  ADDSCENE_PF_GROUP: number,
  ADDSCENE_PF_UNKNOWN: number,
  ADDSCENE_PF_MOBILE: number,
  ADDSCENE_PF_WEB: number,
  TIMEOUT_SYNC_CHECK: number,
  EMOJI_FLAG_GIF: number,
  KEYCODE_BACKSPACE: number,
  KEYCODE_ENTER: number,
  KEYCODE_SHIFT: number,
  KEYCODE_ESC: number,
  KEYCODE_DELETE: number,
  KEYCODE_ARROW_LEFT: number,
  KEYCODE_ARROW_UP: number,
  KEYCODE_ARROW_RIGHT: number,
  KEYCODE_ARROW_DOWN: number,
  KEYCODE_NUM2: number,
  KEYCODE_AT: number,
  KEYCODE_NUM_ADD: number,
  KEYCODE_NUM_MINUS: number,
  KEYCODE_ADD: number,
  KEYCODE_MINUS: number,
  MM_NOTIFY_CLOSE: number,
  MM_NOTIFY_OPEN: number,
  MM_SOUND_CLOSE: number,
  MM_SOUND_OPEN: number,
  MM_SEND_FILE_STATUS_QUEUED: number,
  MM_SEND_FILE_STATUS_SENDING: number,
  MM_SEND_FILE_STATUS_SUCCESS: number,
  MM_SEND_FILE_STATUS_FAIL: number,
  MM_SEND_FILE_STATUS_CANCEL: number,

  STATE: BotState,
};
