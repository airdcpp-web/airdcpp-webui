import { MockHintedUser1Response } from './user';

export const MOCK_FILELIST_ID = 'filelist1';
export const MOCK_FILELIST_ITEM_ID = 323;

export const FilelistGetFilelistItemFileResponse = {
  complete: true,
  dupe: null,
  id: MOCK_FILELIST_ITEM_ID,
  name: 'ubuntu-20.04.2.0-desktop-amd64.iso',
  path: '/Downloads/ubuntu-20.04.2.0-desktop-amd64.iso',
  size: 2877227008,
  time: 1618062636,
  tth: '2E2P2K5JP6KARHNFGUMIFENN4SGBENKLPGQNUAA',
  type: {
    content_type: '',
    id: 'file',
    str: 'iso',
  },
};

export const FilelistGetResponse = {
  id: 'HPI67YG335U72FUS626M6WYFGR5EBZTNCEJU3JA',
  location: null,
  partial_list: true,
  read: false,
  share_profile: null,
  state: {
    id: 'download_pending',
    str: 'Download pending',
    time_finished: 0,
  },
  total_files: 936066,
  total_size: 133137630299481,
  user: MockHintedUser1Response,
};
