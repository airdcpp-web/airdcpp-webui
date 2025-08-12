import {
  MockHintedUser1Response,
  MockHintedUser2Response,
  MockHintedUserNMDCResponse,
} from './user';

import * as API from '@/types/api';

// Instances
export const SearchInstance1Response = {
  current_search_id: '856675959',
  expires_in: null,
  id: 2,
  owner: 'session:65277045:webui',
  query: {
    excluded: [],
    extensions: [],
    file_type: 'any',
    max_size: null,
    min_size: null,
    pattern: 'ubuntu',
  },
  queue_time: 0,
  queued_count: 0,
  result_count: 7,
  searches_sent_ago: 514,
};

export const SearchInstanceNewResponse = {
  current_search_id: '',
  expires_in: null,
  id: 3,
  owner: 'session:2556366335:webui',
  query: null,
  queue_time: 0,
  queued_count: 0,
  result_count: 0,
  searches_sent_ago: 0,
};

export const SearchInstanceHubSearchPostResponse = {
  query: {
    excluded: [],
    extensions: [],
    file_type: 'any',
    max_size: null,
    min_size: null,
    pattern: 'ubuntu',
  },
  queue_time: 0,
  queued_count: 3,
  search_id: '3917272947',
};

export const SearchInstanceListResponse = [SearchInstance1Response];

// Grouped results
export const ChildSearchResult1 = {
  connection: 25000000,
  dupe: null,
  id: 64,
  ip: {
    country: 'DE',
    ip: '2a03:4004:45:de:a453:91ff:feec:8444',
    str: 'DE (2a03:4004:45:de:a453:91ff:feec:8444)',
  },
  name: 'Ubuntu 15.10 Server',
  path: '/Ubuntu 15.10 Server/',
  size: 662700509,
  slots: {
    free: 23,
    str: '23/23',
    total: 23,
  },
  time: 1453224470,
  tth: '',
  type: {
    directories: 0,
    files: 2,
    id: 'directory',
    str: '2 files',
  },
  user: MockHintedUser2Response,
};

export const GroupedSearchResultChildrenResponse = [ChildSearchResult1];

export const GroupedSearchResultDirectoryResponse = {
  connection: 25000000,
  dupe: null,
  hits: 1,
  id: 'CJRB2M3GN5JCI4MA2TP3ZHV4BQEJUKRYGQ6QH5I',
  name: 'Ubuntu 15.10 Server',
  path: '/Ubuntu 15.10 Server/',
  relevance: 0.9674468085106384,
  size: 662700509,
  slots: {
    free: 23,
    str: '23/23',
    total: 23,
  },
  time: 1453224470,
  tth: '',
  type: {
    directories: 0,
    files: 2,
    id: 'directory',
    str: '2 files',
  },
  users: {
    count: 1,
    user: MockHintedUser2Response,
  },
};

export const GroupedSearchResultFileResponse = {
  connection: 16905216,
  dupe: {
    id: 'share_full' as API.DupeEnum,
    paths: ['/home/airdcpp/Downloads/ubuntu_20.04.iso'],
  },
  hits: 2,
  id: 'QJK6LQZ2S2LTCA7RWPGQZDTKOMOUCVW46A6VB5Q',
  name: 'ubuntu_20.04.iso',
  path: '/Downloads/ubuntu_20.04.iso',
  relevance: 0.9561702127659575,
  size: 997179392,
  slots: {
    free: 16,
    str: '16/16',
    total: 16,
  },
  time: 1491053005,
  tth: 'QJK6LQZ2S2LTCA7RWPGQZDTKOMOUCVW46A6VB5Q',
  type: {
    content_type: '',
    id: 'file',
    str: 'iso',
  },
  users: {
    count: 2,
    user: MockHintedUserNMDCResponse,
  },
};

export const GroupedSearchResultsListResponse = [
  {
    connection: 128000,
    dupe: {
      id: 'queue_partial' as API.DupeEnum,
      paths: ['/home/airdcpp/Downloads/Ubuntu/'],
    },
    hits: 1,
    id: 'KBGL3F7QDOE2LXEPRIRVEXDAKTP3U4R6MQUHZWI',
    name: 'Ubuntu',
    path: '/Downloads/Ubuntu/',
    relevance: 1.01,
    size: 0,
    slots: {
      free: 8,
      str: '8/8',
      total: 8,
    },
    time: 1527784478,
    tth: '',
    type: {
      directories: 0,
      files: 0,
      id: 'directory',
      str: '0 files',
    },
    users: {
      count: 1,
      user: MockHintedUser2Response,
    },
  },
  {
    connection: 16777216,
    dupe: {
      id: 'queue_partial' as API.DupeEnum,
      paths: ['/home/airdcpp/Downloads/Ubuntu/'],
    },
    hits: 1,
    id: 'OK2EAAPWP4AABABSIFNEOAQAADUDG6S5I4BAAAA',
    name: 'Ubuntu',
    path: '/Downloads/Ubuntu/',
    relevance: 1.01,
    size: 0,
    slots: {
      free: 8,
      str: '8/8',
      total: 8,
    },
    time: 0,
    tth: '',
    type: {
      id: 'directory',
      str: '',
    },
    users: {
      count: 1,
      user: MockHintedUser1Response,
    },
  },
  GroupedSearchResultDirectoryResponse,
  GroupedSearchResultFileResponse,
  {
    connection: 16905216,
    dupe: null,
    hits: 2,
    id: '2E2P2K5JP6KARHNFGUMIFENN4SGBENKLPGQNUAA',
    name: 'ubuntu-20.04.2.0-desktop-amd64.iso',
    path: '/Downloads/ubuntu-20.04.2.0-desktop-amd64.iso',
    relevance: 0.9561702127659575,
    size: 2877227008,
    slots: {
      free: 16,
      str: '16/16',
      total: 16,
    },
    time: 1618062636,
    tth: '2E2P2K5JP6KARHNFGUMIFENN4SGBENKLPGQNUAA',
    type: {
      content_type: '',
      id: 'file',
      str: 'iso',
    },
    users: {
      count: 2,
      user: MockHintedUser2Response,
    },
  },
  {
    connection: 25000000,
    dupe: null,
    hits: 1,
    id: 'JZ75G7QCTPF6JOB6LN567ZPD6TYYWSVVDR2ZUEY',
    name: 'ubuntu-15.10-server-amd64.iso',
    path: '/Ubuntu 15.10 Server/ubuntu-15.10-server-amd64.iso',
    relevance: 0.8871702127659574,
    size: 662700032,
    slots: {
      free: 23,
      str: '23/23',
      total: 23,
    },
    time: 1445449192,
    tth: 'JZ75G7QCTPF6JOB6LN567ZPD6TYYWSVVDR2ZUEY',
    type: {
      content_type: '',
      id: 'file',
      str: 'iso',
    },
    users: {
      count: 1,
      user: MockHintedUser1Response,
    },
  },
  {
    connection: 25000000,
    dupe: null,
    hits: 1,
    id: 'BOCIJF4NRUTLSBS4WPZFWGPBMG7FJIGTUARJCUQ',
    name: 'ubuntu-15.10-server-amd64.nfo',
    path: '/Ubuntu 15.10 Server/ubuntu-15.10-server-amd64.nfo',
    relevance: 0.8871702127659574,
    size: 477,
    slots: {
      free: 23,
      str: '23/23',
      total: 23,
    },
    time: 1453224456,
    tth: 'BOCIJF4NRUTLSBS4WPZFWGPBMG7FJIGTUARJCUQ',
    type: {
      content_type: 'document',
      id: 'file',
      str: 'nfo',
    },
    users: {
      count: 1,
      user: MockHintedUser1Response,
    },
  },
];
