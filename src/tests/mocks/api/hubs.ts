import {
  ShareProfile2Base,
  ShareProfileDefaultBase,
  ShareProfileHiddenBase,
} from './share-profiles';

export const HubNMDC1 = {
  connect_state: {
    id: 'connected',
    str: 'Connected',
  },
  encryption: null,
  favorite_hub: 547596534,
  hub_url: 'localhost.nmdc',
  id: 1,
  identity: {
    description: 'NMDC mock hub',
    name: 'NMDC',
    supports: [],
  },
  message_counts: {
    total: 9,
    unread: {
      bot: 2,
      mention: 0,
      status: 5,
      user: 0,
      verbose: 2,
    },
  },
  settings: {
    fav_show_joins: false,
    nick: 'user_nmdc',
    show_joins: true,
    use_main_chat_notify: false,
  },
  share_profile: ShareProfileDefaultBase,
};

export const HubADC1 = {
  connect_state: {
    id: 'connected',
    str: 'Connected',
  },
  encryption: {
    str: 'TLSv1.2 / ECDHE-ECDSA-AES128-GCM-SHA256',
    trusted: true,
  },
  favorite_hub: 1586142342,
  hub_url:
    'adcs://hub1.adc/?kp=SHA256/H4DUKGI3U3LQHMZXU6SLQA7LF5RVD6HJFGYZBN2R5RRQ5A2RZ4ZA',
  id: 2,
  identity: {
    description: 'Mock ADC hub 1',
    name: 'ADC hub 1',
    supports: ['BAS0', 'BASE', 'TIGR', 'KEYP', 'OSNR', 'UCM0', 'UCMD'],
  },
  message_counts: {
    total: 31,
    unread: {
      bot: 0,
      mention: 0,
      status: 0,
      user: 0,
      verbose: 0,
    },
  },
  settings: {
    fav_show_joins: false,
    nick: 'user_adc',
    show_joins: true,
    use_main_chat_notify: false,
  },
  share_profile: ShareProfile2Base,
};

export const HubADC2 = {
  connect_state: {
    id: 'disconnected',
    str: 'Disconnected',
  },
  encryption: null,
  favorite_hub: 0,
  hub_url: 'adcs://hub2.adc:2781',
  id: 3,
  identity: {
    description: '',
    name: 'adcs://hub2.adc:2781',
    supports: [],
  },
  message_counts: {
    total: 100,
    unread: {
      bot: 0,
      mention: 0,
      status: 61,
      user: 0,
      verbose: 0,
    },
  },
  settings: {
    fav_show_joins: false,
    nick: 'user_adc',
    show_joins: false,
    use_main_chat_notify: false,
  },
  share_profile: ShareProfileDefaultBase,
};

export const HubADC3 = {
  connect_state: {
    id: 'connected',
    str: 'Connected',
  },
  encryption: {
    str: 'TLSv1.3 / TLS_AES_256_GCM_SHA384',
    trusted: false,
  },
  favorite_hub: 1838189668,
  hub_url: 'adcs://hub3.adc:2482',
  id: 4,
  identity: {
    description: 'Mock ADC hub 3',
    name: 'ADC hub 3',
    supports: ['BASE', 'TIGR', 'HBRI', 'PING'],
  },
  message_counts: {
    total: 19,
    unread: {
      bot: 0,
      mention: 0,
      status: 0,
      user: 0,
      verbose: 0,
    },
  },
  settings: {
    fav_show_joins: false,
    nick: 'adc_user',
    show_joins: false,
    use_main_chat_notify: true,
  },
  share_profile: ShareProfileHiddenBase,
};

export const HubsListResponse = [HubNMDC1, HubADC1, HubADC2, HubADC3];
