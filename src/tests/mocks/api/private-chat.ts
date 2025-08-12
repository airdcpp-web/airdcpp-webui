import {
  Hub1User1Response,
  Hub1UserMeResponse,
  MockHintedUserNMDCResponse,
  MockHintedUserOfflineResponse,
  MockHintedUser1Response,
  HubNMDC1UserMeResponse,
  HubNMDC1UserResponse,
} from './user';

import * as API from '@/types/api';

export const PrivateChat1 = {
  ccpm_state: {
    encryption: {
      str: 'TLSv1.3 / TLS_AES_256_GCM_SHA384',
      trusted: true,
    },
    id: 'connected' as API.CCPMStateEnum,
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
    id: 'disconnected' as API.CCPMStateEnum,
    str: 'Disconnected',
  },
  id: MockHintedUserNMDCResponse.cid,
  message_counts: {
    total: 0,
    unread: {
      bot: 1,
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
    id: 'disconnected' as API.CCPMStateEnum,
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
  text: 'A direct encrypted channel has been established (ADC 1)',
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
  text: 'my message ADC 1',
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
  text: 'received ADC 1 message',
  third_person: false,
  time: 1739705382,
  to: Hub1UserMeResponse,
};

export const PrivateChat2MessageOther = {
  from: HubNMDC1UserResponse,
  has_mention: false,
  highlights: [],
  id: 20,
  is_read: true,
  reply_to: HubNMDC1UserResponse,
  text: 'received NMDC message',
  third_person: false,
  time: 1739705342,
  to: HubNMDC1UserMeResponse,
};

export const PrivateChat1MessageMagnet = {
  from: Hub1User1Response,
  has_mention: false,
  highlights: [
    {
      content_type: '' as API.FileContentType,
      dupe: {
        id: 'share_full' as API.DupeEnum,
        paths: ['/tmp/3825835894'],
      },
      id: 805,
      position: {
        end: 94,
        start: 0,
      },
      tag: 'temp_share',
      text: 'magnet:?xt=urn:tree:tiger:S7WYZE2NGBFNTZQ4J65ZOTSIQJ2GLPJJRVC3IZQ&xl=42128&dn=putty+test.log',
      type: 'link_url' as API.MessageHighlightTypeEnum,
    },
  ],
  id: 100,
  is_read: true,
  reply_to: Hub1User1Response,
  text: 'magnet:?xt=urn:tree:tiger:S7WYZE2NGBFNTZQ4J65ZOTSIQJ2GLPJJRVC3IZQ&xl=4215028&dn=putty+test.log',
  third_person: false,
  time: 1739964582,
  to: Hub1UserMeResponse,
};

export const PrivateChat1MessageMention = {
  from: Hub1User1Response,
  has_mention: true,
  highlights: [
    {
      content_type: null,
      dupe: null,
      id: 3816,
      position: {
        end: 12,
        start: 6,
      },
      tag: 'me',
      text: 'maksis',
      type: 'user' as API.MessageHighlightTypeEnum,
    },
  ],
  id: 101,
  is_read: false,
  reply_to: Hub1User1Response,
  text: 'hello maksis',
  third_person: false,
  time: 1740310182,
  to: Hub1UserMeResponse,
};

export const PrivateChat1MessageRelease = {
  from: Hub1User1Response,
  has_mention: false,
  highlights: [
    {
      content_type: null,
      dupe: null,
      id: 814,
      position: {
        end: 26,
        start: 9,
      },
      tag: 'release',
      text: 'Test.Release-TEST',
      type: 'link_text' as API.MessageHighlightTypeEnum,
    },
  ],
  id: 102,
  is_read: false,
  reply_to: Hub1User1Response,
  text: 'download Test.Release-TEST from me',
  third_person: false,
  time: 1741346982,
  to: Hub1UserMeResponse,
};

export const PrivateChat1MessageThirdParty = {
  from: Hub1User1Response,
  has_mention: false,
  highlights: [],
  id: 103,
  is_read: false,
  reply_to: Hub1User1Response,
  text: 'is here',
  third_person: true,
  time: 1741346992,
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
  {
    chat_message: PrivateChat1MessageMagnet,
  },
  {
    chat_message: PrivateChat1MessageMention,
  },
  {
    chat_message: PrivateChat1MessageRelease,
  },
  {
    chat_message: PrivateChat1MessageThirdParty,
  },
];

export const PrivateChat2MessagesResponse = [
  {
    chat_message: PrivateChat2MessageOther,
  },
];
