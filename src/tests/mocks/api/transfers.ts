import { MockHintedUser1Response, MockHintedUser2Response } from './user';

export const TransferStatsResponse = {
  download_bundles: 1,
  downloads: 3,
  limit_down: 100,
  limit_up: 0,
  queued_bytes: 2238776248,
  session_downloaded: 29207823,
  session_uploaded: 60850854,
  speed_down: 424,
  speed_up: 53215156,
  upload_bundles: 0,
  uploads: 1,
};

export const TransferListResponse = [
  {
    bytes_transferred: 1369,
    download: true,
    encryption: {
      str: 'TLSv1.3 / TLS_AES_256_GCM_SHA384',
      trusted: true,
    },
    flags: ['M', 'S', 'Z'],
    id: 2,
    ip: {
      country: '',
      ip: '192.168.50.200',
      str: '192.168.50.200',
    },
    name: 'file list partial',
    queue_file_id: 431,
    seconds_left: 0,
    size: 1369,
    speed: 0,
    status: {
      id: 'finished',
      str: 'Download finished, idle...',
    },
    supports: ['BAS0', 'BASE', 'BZIP', 'TIGR', 'MCN1', 'CPMI', 'ZLIG', 'UBN1'],
    target:
      '/home/airdcpp/.airdc++/FileLists/test1.HNLUODI2YZ2U7FDWMHFNJU65ERGKGN4MH7GW5LY.partial[_Videos_]',
    time_started: 3723887,
    type: {
      content_type: 'filelist',
      id: 'file',
      str: 'file list partial',
    },
    user: MockHintedUser2Response,
  },
  {
    bytes_transferred: -1,
    download: true,
    encryption: {
      str: 'TLSv1.3 / TLS_AES_256_GCM_SHA384',
      trusted: true,
    },
    flags: ['C', 'M', 'S'],
    id: 5,
    ip: {
      country: '',
      ip: '192.168.50.10',
      str: '192.168.50.10',
    },
    name: 'TTH: file1.test',
    queue_file_id: 288,
    seconds_left: -1,
    size: -1,
    speed: -1,
    status: {
      id: 'failed',
      str: 'No full tree available',
    },
    supports: ['BAS0', 'BASE', 'BZIP', 'TIGR', 'MCN1', 'CPMI', 'ZLIG', 'UBN1'],
    target: '/home/airdcpp/Downloads/file1.test',
    time_started: 3662883,
    type: {
      content_type: '',
      id: 'file',
      str: 'r35',
    },
    user: MockHintedUser1Response,
  },
  {
    bytes_transferred: 834682,
    download: true,
    encryption: {
      str: 'TLSv1.3 / TLS_AES_256_GCM_SHA384',
      trusted: true,
    },
    flags: ['C', 'M', 'S', 'T', 'Z'],
    id: 5,
    ip: {
      country: '',
      ip: '192.168.50.10',
      str: '192.168.50.10',
    },
    name: 'file2.test',
    queue_file_id: 15,
    seconds_left: 6,
    size: 2097152,
    speed: 209508,
    status: {
      id: 'running',
      str: 'Running (39.8%)',
    },
    supports: ['BAS0', 'BASE', 'BZIP', 'TIGR', 'MCN1', 'CPMI', 'ZLIG', 'UBN1'],
    target: '/mnt/disk1/file2.test',
    time_started: 3886634,
    type: {
      content_type: 'executable',
      id: 'file',
      str: 'exe',
    },
    user: MockHintedUser1Response,
  },
];
