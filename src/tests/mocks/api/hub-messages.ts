import { Hub1Identity, Hub1User1Response, Hub1UserMeResponse } from './user';

export const Hub1MessageMe = {
  from: Hub1UserMeResponse,
  has_mention: false,
  highlights: [],
  id: 103,
  is_read: true,
  text: 'testing',
  third_person: false,
  time: 1755876262,
};

export const Hub1MessageOther = {
  from: Hub1User1Response,
  has_mention: false,
  highlights: [],
  id: 104,
  is_read: true,
  text: 'success',
  third_person: false,
  time: 1755876278,
};

export const HubADC1MessageListResponse = [
  {
    log_message: {
      highlights: [
        {
          content_type: null,
          dupe: null,
          id: 12,
          position: {
            end: 45,
            start: 14,
          },
          tag: 'url',
          text: 'adcs://abcxyz.example.test:2482',
          type: 'link_url',
        },
      ],
      id: 37,
      is_read: true,
      label: '',
      severity: 'info',
      text: 'Connecting to adcs://abcxyz.example.test:2482 ...',
      time: 1755872889,
      type: 'server',
    },
  },
  {
    log_message: {
      highlights: [],
      id: 38,
      is_read: true,
      label: '',
      severity: 'info',
      text: 'Connected',
      time: 1755872889,
      type: 'server',
    },
  },
  {
    log_message: {
      highlights: [],
      id: 40,
      is_read: true,
      label: '',
      severity: 'info',
      text: 'Stored password sent...',
      time: 1755872889,
      type: 'server',
    },
  },
  {
    chat_message: {
      from: Hub1Identity,
      has_mention: false,
      highlights: [],
      id: 41,
      is_read: true,
      text: 'This hub is running ADCH++ 3.0.0 (r"[unknown]") Release',
      third_person: false,
      time: 1755872890,
    },
  },
  {
    chat_message: {
      from: Hub1Identity,
      has_mention: false,
      highlights: [],
      id: 42,
      is_read: true,
      text: 'Welcome back',
      third_person: false,
      time: 1755872890,
    },
  },
  {
    log_message: {
      highlights: [],
      id: 43,
      is_read: true,
      label: '',
      severity: 'info',
      text: 'Validating the IPv6 address...',
      time: 1755872890,
      type: 'server',
    },
  },
  {
    log_message: {
      highlights: [],
      id: 44,
      is_read: true,
      label: '',
      severity: 'info',
      text: 'Validation succeeded',
      time: 1755872890,
      type: 'server',
    },
  },
  {
    chat_message: {
      from: Hub1Identity,
      has_mention: false,
      highlights: [
        {
          content_type: '',
          dupe: null,
          id: 13,
          position: {
            end: 523,
            start: 429,
          },
          tag: 'magnet',
          text: 'magnet:?xt=urn:tree:tiger:S7WYZE2NGBFNTFQ4J65ZOTSIQJ2GLPJJRVC3IZQ&xl=4215028&dn=data1+test.log',
          type: 'link_url',
        },
      ],
      id: 45,
      is_read: true,
      // eslint-disable-next-line max-len
      text: 'Displaying the last 10 messages\n- [2025-08-05 10:37:16] * user_alpha___ gasgasg\n- [2025-08-05 10:39:28] * user_alpha___ gfasgg\n- [2025-08-05 10:42:21] * user_beta_xxxxxxxxxxxxxxxxxxxxxxxxx gsaga\n- [2025-08-05 10:42:49] * user_alpha___ gsagsag\n- [2025-08-07 18:30:35] <user_beta_xxxxxxxxxxxxxxxxxxxxxxxxx> gsagsag\n- [2025-08-07 18:31:15] <user_beta_xxxxxxxxxxxxxxxxxxxxxxxxx> user_alpha___\n- [2025-08-12 10:25:23] <user_alpha___> magnet:?xt=urn:tree:tiger:S7WYZE2NGBFNTFQ4J65ZOTSIQJ2GLPJJRVC3IZQ&xl=4215028&dn=data1+test.log\n- [2025-08-12 20:53:35] <VPS> .\n- [2025-08-12 20:53:44] <VPS> .\n- [2025-08-12 20:53:47] <VPS> .',
      third_person: false,
      time: 1755872890,
    },
  },
  {
    chat_message: Hub1MessageMe,
  },
  {
    chat_message: Hub1MessageOther,
  },
];

export const HubDisconnectedMessageListResponse = [
  {
    log_message: {
      highlights: [
        {
          content_type: null,
          dupe: null,
          id: 11,
          position: {
            end: 35,
            start: 14,
          },
          tag: 'url',
          text: 'adcs://localhost:2781',
          type: 'link_url',
        },
      ],
      id: 30,
      is_read: true,
      label: '',
      severity: 'info',
      text: 'Connecting to adcs://localhost:2781 ...',
      time: 1755872888,
      type: 'server',
    },
  },
  {
    log_message: {
      highlights: [],
      id: 58,
      is_read: true,
      label: '',
      severity: 'warning',
      text: 'Connection timeout',
      time: 1755872918,
      type: 'server',
    },
  },
  {
    log_message: {
      highlights: [
        {
          content_type: null,
          dupe: null,
          id: 14,
          position: {
            end: 35,
            start: 14,
          },
          tag: 'url',
          text: 'adcs://localhost:2781',
          type: 'link_url',
        },
      ],
      id: 59,
      is_read: true,
      label: '',
      severity: 'info',
      text: 'Connecting to adcs://localhost:2781 ...',
      time: 1755873032,
      type: 'server',
    },
  },
];
