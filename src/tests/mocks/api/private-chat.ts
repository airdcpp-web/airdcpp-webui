import {
  Hub1User1Response,
  Hub1UserMeResponse,
  MockHintedUserNMDCResponse,
  MockHintedUserOfflineResponse,
  MockHintedUser1Response,
} from './user';

import * as API from '@/types/api';

export const PrivateChat1 = {
  ccpm_state: {
    encryption: {
      str: 'TLSv1.3 / TLS_AES_256_GCM_SHA384',
      trusted: true,
    },
    id: 'connected',
    str: 'Connected',
  },
  id: MockHintedUser1Response.cid,
  message_counts: {
    total: 14,
    unread: {
      bot: 0,
      mention: 0,
      status: 14,
      user: 0,
      verbose: 0,
    },
  },
  user: MockHintedUser1Response,
};

export const PrivateChat2 = {
  ccpm_state: {
    encryption: null,
    id: 'disconnected',
    str: 'Disconnected',
  },
  id: MockHintedUserNMDCResponse.cid,
  message_counts: {
    total: 0,
    unread: {
      bot: 0,
      mention: 0,
      status: 0,
      user: 0,
      verbose: 0,
    },
  },
  user: MockHintedUserNMDCResponse,
};

export const PrivateChat3 = {
  ccpm_state: {
    encryption: null,
    id: 'disconnected',
    str: 'Disconnected',
  },
  id: MockHintedUserOfflineResponse.cid,
  message_counts: {
    total: 0,
    unread: {
      bot: 0,
      mention: 0,
      status: 0,
      user: 0,
      verbose: 0,
    },
  },
  user: MockHintedUserOfflineResponse,
};

export const PrivateChatListResponse = [PrivateChat1, PrivateChat2, PrivateChat3];

export const PrivateChat1MessageStatus = {
  highlights: [],
  id: 1,
  is_read: true,
  label: '',
  severity: API.SeverityEnum.INFO,
  text: 'A direct encrypted channel has been established',
  time: 1739705318,
  type: API.StatusMessageTypeEnum.SYSTEM,
};

export const PrivateChat1MessageMe = {
  from: Hub1UserMeResponse,
  has_mention: false,
  highlights: [],
  id: 2,
  is_read: true,
  reply_to: Hub1UserMeResponse,
  text: 'my message',
  third_person: false,
  time: 1739705360,
  to: Hub1User1Response,
};

export const PrivateChat1MessageOther = {
  from: Hub1User1Response,
  has_mention: false,
  highlights: [],
  id: 3,
  is_read: true,
  reply_to: Hub1User1Response,
  text: 'received message',
  third_person: false,
  time: 1739705382,
  to: Hub1UserMeResponse,
};

export const PrivateChat1MessagesResponse = [
  {
    log_message: PrivateChat1MessageStatus,
  },
  {
    chat_message: PrivateChat1MessageMe,
  },
  {
    chat_message: PrivateChat1MessageOther,
  },
];
