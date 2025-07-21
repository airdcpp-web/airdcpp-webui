import { MockHintedUser1Response } from './user';

export const ShareGetGroupedRootsResponse = [
  {
    name: 'Downloads',
    paths: ['/home/airdcpp/Downloads/', '/mnt/Downloads/'],
  },
  {
    name: 'Test',
    paths: ['/home/airdcpp/Test/'],
  },
  {
    name: '🌍',
    paths: ['/mnt/disk1/🌍/'],
  },
];

export const ShareGetRefreshTasksResponse = [];

export const ShareTempItemListResponse = [
  {
    id: 1878753295,
    name: 'tsconfig.json',
    path: '/tmp/512798507',
    size: 1054,
    time_added: 1753099735,
    tth: 'NE4VKQAOJDMJRXH253CNLRJQ746OREIHWPL4VBQ',
    type: {
      content_type: '',
      id: 'file',
      str: 'json',
    },
    user: MockHintedUser1Response,
  },
];
