import { ShareProfile2Base } from './share-profiles';
import {
  MockHintedUser1Response,
  MockHintedUser2Response,
  MockHintedUserMeResponse,
} from './user';

import * as API from '@/types/api';

export const MOCK_FILELIST_ID = 'filelist1';
export const MOCK_FILELIST_ITEM_ID = 323;

export const FilelistGetFilelistItemFileResponse = {
  complete: true,
  dupe: null,
  id: MOCK_FILELIST_ITEM_ID,
  name: 'ubuntu-20.04.2.0-desktop-amd64.iso',
  path: '/Ubuntu 20.04 Server/ubuntu-20.04.2.0-desktop-amd64.iso',
  size: 2877227008,
  time: 1618062636,
  tth: '2E2P2K5JP6KARHNFGUMIFENN4SGBENKLPGQNUAA',
  type: {
    content_type: '',
    id: 'file',
    str: 'iso',
  },
};

export const FilelistGetFilelistItemDirectoryResponse = {
  complete: false,
  dupe: null,
  id: 34,
  name: 'Ubuntu 20.04 Server',
  path: '/Ubuntu 20.04 Server/',
  size: 662700509,
  time: 1453224470,
  tth: '',
  type: {
    directories: 0,
    files: 2,
    id: 'directory',
    str: '2 files',
  },
};

export const FilelistDirectoryItemsList = {
  items: [
    FilelistGetFilelistItemFileResponse,
    {
      complete: true,
      dupe: null,
      id: 73865,
      name: 'Folder empty',
      path: '/Ubuntu 20.04 Server/Folder 1/',
      size: 0,
      time: 1453120275,
      tth: '',
      type: {
        directories: 0,
        files: 0,
        id: 'directory',
        str: '0 files',
      },
    },
    {
      complete: true,
      dupe: null,
      id: 40,
      name: 'ubuntu-20.04-server-amd64.nfo',
      path: '/Ubuntu 20.04 Server/ubuntu-20.04-server-amd64.nfo',
      size: 477,
      time: 1453224456,
      tth: 'BOCIJF4NRUTLSBS4WPZFWGPBMG7FJIGTUARJCUQ',
      type: {
        content_type: 'document',
        id: 'file',
        str: 'nfo',
      },
    },
  ],
  list_path: '/Ubuntu 20.04 Server/',
};

export const FilelistRootItemsList = {
  items: [
    {
      complete: false,
      dupe: null,
      id: 36,
      name: '100k items',
      path: '/100k items/',
      size: 0,
      time: 1453120315,
      tth: '',
      type: {
        directories: 100000,
        files: 0,
        id: 'directory',
        str: '100,0k folders',
      },
    },
    {
      complete: false,
      dupe: null,
      id: 38,
      name: 'adchpp-hbri',
      path: '/adchpp-hbri/',
      size: 15562497,
      time: 1726408641,
      tth: '',
      type: {
        directories: 1420,
        files: 2348,
        id: 'directory',
        str: '1420 folders, 2,3k files',
      },
    },
    {
      complete: false,
      dupe: {
        id: 'share_full',
        paths: ['/home/airdcpp/Downloads/Demo audio/'],
      },
      id: 35,
      name: 'Demo audio',
      path: '/Demo audio/',
      size: 8494831,
      time: 1453804935,
      tth: '',
      type: {
        directories: 0,
        files: 3,
        id: 'directory',
        str: '3 files',
      },
    },
    {
      complete: false,
      dupe: null,
      id: 32,
      name: 'Demo content',
      path: '/Demo content/',
      size: 3104,
      time: 1452433440,
      tth: '',
      type: {
        directories: 0,
        files: 1,
        id: 'directory',
        str: '1 file',
      },
    },
    {
      complete: false,
      dupe: null,
      id: 37,
      name: 'Demo pictures',
      path: '/Demo pictures/',
      size: 47026894,
      time: 1453241361,
      tth: '',
      type: {
        directories: 0,
        files: 21,
        id: 'directory',
        str: '21 files',
      },
    },
    {
      complete: false,
      dupe: null,
      id: 33,
      name: 'Demo videos',
      path: '/Demo videos/',
      size: 9903562,
      time: 1453804937,
      tth: '',
      type: {
        directories: 0,
        files: 2,
        id: 'directory',
        str: '2 files',
      },
    },
    {
      complete: false,
      dupe: null,
      id: 31,
      name: 'develop',
      path: '/develop/',
      size: 3221954493,
      time: 1751983557,
      tth: '',
      type: {
        directories: 2,
        files: 37,
        id: 'directory',
        str: '2 folders, 37 files',
      },
    },
    FilelistGetFilelistItemDirectoryResponse,
  ],
  list_path: '/',
};

export const FilelistStateLoaded = {
  id: 'loaded' as API.DownloadableItemStateEnum,
  str: 'Loaded',
};

export const FilelistStatePending = {
  id: 'download_pending' as API.DownloadableItemStateEnum,
  str: 'Download pending',
  time_finished: 0,
};

export const FilelistLoadedResponse = {
  id: MockHintedUser2Response.cid,
  location: {
    complete: true,
    dupe: null,
    id: 30,
    name: '/',
    path: '/',
    size: 3965645890,
    time: 1751983557,
    tth: '',
    type: {
      directories: 101430,
      files: 2414,
      id: 'directory',
      str: '101,4k folders, 2,4k files',
    } as API.DirectoryType,
  },
  partial_list: true,
  read: true,
  share_profile: null,
  state: FilelistStateLoaded,
  total_files: 2424,
  total_size: 3965645890,
  user: MockHintedUser1Response,
};

export const FilelistPendingResponse = {
  id: 'HPI67YG335U72FUS626M6WYFGR5EBZTNCEJU3JA',
  location: null,
  partial_list: true,
  read: false,
  share_profile: null,
  state: FilelistStatePending,
  total_files: 936066,
  total_size: 133137630299481,
  user: MockHintedUser2Response,
};

export const FilelistMeResponse = {
  id: MockHintedUserMeResponse.cid,
  location: {
    complete: true,
    dupe: {
      id: 'share_full' as API.DupeEnum,
      paths: [],
    },
    id: 100145,
    name: '/',
    path: '/',
    size: 63484055205,
    time: 1755714352,
    tth: '',
    type: {
      directories: 164,
      files: 1155,
      id: 'directory',
      str: '164 folders, 1155 files',
    } as API.DirectoryType,
  },
  partial_list: true,
  read: true,
  share_profile: ShareProfile2Base,
  state: FilelistStateLoaded,
  total_files: 3217,
  total_size: 51349548848,
  user: MockHintedUserMeResponse,
};

export const FilelistListResponse = [
  FilelistLoadedResponse,
  FilelistPendingResponse,
  FilelistMeResponse,
];

export const FilelistDirectoryDownloadResponse = {
  error: '',
  id: 0,
  list_path: FilelistGetFilelistItemDirectoryResponse.path,
  priority: null,
  queue_info: null,
  state: 'pending',
  target_directory: '/home/airdcpp/Downloads/',
  target_name: FilelistGetFilelistItemDirectoryResponse.name,
  user: MockHintedUser2Response,
};
