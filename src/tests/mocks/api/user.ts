import { toMockHintedUser } from '../helpers/mock-user-helpers';
import { HubADC1, HubADC2, HubADC3, HubNMDC1 } from './hubs';

import * as API from '@/types/api';

const User1Base = {
  cid: 'HNLUODI2YZ2U7FDWMHFNJU65ERGKUN4MH7GW5LY',
};

const User2Base = {
  cid: 'NJSHVYR4ZHCZFUEZNGA7M2D72S5AB4WQAMPBKFA',
};

const UserMeBase = {
  cid: 'G6SHNIXXWL4JV5OSM3GLMYK7UHOVFKF7GSUIGAY',
};

export const Hub1User1Response = {
  ...User1Base,
  description: '[ REG ] ',
  download_speed: 118750000,
  email: '',
  file_count: 55228,
  flags: ['asch', 'ccpm'] as API.HubUserFlag[],
  hub_name: HubADC1.identity.name,
  hub_session_id: 1,
  hub_url: HubADC1.hub_url,
  id: 1213154642,
  ip4: {
    country: '',
    ip: '192.168.50.200',
    str: '192.168.50.200',
  },
  ip6: {
    country: '',
    ip: '',
    str: '',
  },
  nick: '[Hub1]User1',
  share_size: 7379226364015,
  supports: ['SEGA', 'ADC0', 'CCPM', 'SUD1', 'TCP4', 'UDP4', 'ASCH'],
  tag: '<AirDC++w 2.13.3,M:A-,H:0/6/1,S:20>',
  upload_slots: 20,
  upload_speed: 62500000,
};

export const Hub3User1Response = {
  ...User1Base,
  description: '',
  download_speed: 118750000,
  email: '',
  file_count: 55228,
  flags: ['asch', 'ccpm'] as API.HubUserFlag[],
  hub_name: HubADC3.identity.name,
  hub_session_id: 4,
  hub_url: HubADC3.hub_url,
  id: 1146372661,
  ip4: {
    country: '',
    ip: '192.168.50.1',
    str: '192.168.50.1',
  },
  ip6: {
    country: '',
    ip: '',
    str: '',
  },
  nick: '[Hub3]User1',
  share_size: 7379226364015,
  supports: ['SEGA', 'ADC0', 'CCPM', 'SUD1', 'TCP4', 'UDP4', 'ASCH'],
  tag: '<AirDC++w 2.13.3,M:A-,H:0/6/1,S:20>',
  upload_slots: 20,
  upload_speed: 62500000,
};

export const Hub1UserMeResponse = {
  ...UserMeBase,
  description: 'This is me',
  download_speed: 300000,
  email: '',
  file_count: 1527,
  flags: ['self', 'asch', 'ccpm', 'away', 'op'] as API.HubUserFlag[],
  hub_name: HubADC1.identity.name,
  hub_session_id: 1,
  hub_url: HubADC1.hub_url,
  id: 1129136434,
  ip4: {
    country: '',
    ip: '192.168.50.10',
    str: '192.168.50.10',
  },
  ip6: {
    country: '',
    ip: '',
    str: '',
  },
  nick: '[Hub1]Me',
  share_size: 51836303365,
  supports: ['SEGA', 'ADC0', 'CCPM', 'SUD1', 'TCP4', 'UDP4', 'ASCH'],
  tag: '<AirDC++ 4.22b-199-ga179d-d,M:A-,H:0/1/2,S:19>',
  upload_slots: 19,
  upload_speed: 300000,
};

export const HubNMDC1UserMeResponse = {
  ...UserMeBase,
  description: 'This is NMDC me',
  download_speed: 0,
  email: '',
  file_count: 0,
  flags: ['self', 'asch', 'ccpm', 'away', 'op'],
  hub_name: HubNMDC1.identity.name,
  hub_session_id: 1,
  hub_url: HubNMDC1.hub_url,
  id: 67653524,
  ip4: {
    country: '',
    ip: '127.0.0.1',
    str: '127.0.0.1',
  },
  ip6: {
    country: '',
    ip: '',
    str: '',
  },
  nick: '[HubNmdc]Me',
  share_size: 62983875460,
  supports: [],
  tag: '<AirDC++ V:4.22b-219-g07c071,M:A,H:0/1/2,S:19>',
  upload_slots: 19,
  upload_speed: 0,
};

export const Hub3User2Response = {
  ...User2Base,
  description: 'Demo share',
  download_speed: 100000,
  email: '',
  file_count: 49,
  flags: ['asch', 'ccpm', 'away', 'op'] as API.HubUserFlag[],
  hub_name: HubADC3.identity.name,
  hub_session_id: 4,
  hub_url: HubADC3.hub_url,
  id: 1093945941,
  ip4: {
    country: 'DE',
    ip: '55.93.161.54',
    str: 'DE (55.93.161.54)',
  },
  ip6: {
    country: '',
    ip: '',
    str: '',
  },
  nick: '[Hub3]User2',
  share_size: 1287845364,
  supports: ['SEGA', 'ADC0', 'CCPM', 'TCP4', 'UDP4', 'ASCH'],
  tag: '<AirDC++w 2.13.3,M:A-,H:1/0/4,S:23>',
  upload_slots: 23,
  upload_speed: 25000000,
};

export const HubNMDC1UserResponse = {
  cid: 'ZRKX5OA6YMLPDYQBVGKUXMXFDCTVFH3EOKEV6IQ',
  description: '',
  download_speed: 0,
  email: '',
  file_count: 0,
  flags: ['bot', 'nmdc', 'away', 'op'] as API.HubUserFlag[],
  hub_name: HubNMDC1.identity.name,
  hub_session_id: 1,
  hub_url: HubNMDC1.hub_url,
  id: 398271616,
  ip4: {
    country: '',
    ip: '',
    str: '',
  },
  ip6: {
    country: '',
    ip: '',
    str: '',
  },
  nick: 'PtokaX',
  share_size: 0,
  supports: [],
  tag: '',
  upload_slots: 0,
  upload_speed: 0,
};

export const MockHintedUser1Response = toMockHintedUser(Hub1User1Response, [
  Hub3User1Response,
]);

export const MockHintedUser2Response = toMockHintedUser(Hub3User2Response);

export const MockHintedUserNMDCResponse = toMockHintedUser(HubNMDC1UserResponse);

export const MockHintedUserOfflineResponse = {
  cid: 'VZILDK44YRK37UJBED2KLZSORDWRKMLDIYIRULY',
  flags: ['favorite', 'offline'],
  hub_names: 'Offline',
  hub_url: HubADC2.hub_url,
  hub_urls: [],
  nicks: '[VIP]user',
};
