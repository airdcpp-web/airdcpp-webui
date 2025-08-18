export const MOCK_SHARE_ROOT_ID = 'YDCXPCVSPNBXH2WFTKTBZIFZBYNWRWRT2OJ5F6Y';

export const ShareRootNormal = {
  id: 'YDCXPCVSPNBXH2WFTKTBZIFZBYNWRWRT2OJ5F6Y',
  incoming: false,
  last_refresh_time: 1733165117,
  path: '/home/airdcpp/Downloads/',
  profiles: [
    {
      id: 535,
      str: 'Profile 2',
    },
    {
      id: 28550432,
      str: 'Default profile (Default)',
    },
  ],
  size: 0,
  status: {
    id: 'normal',
    refresh_task_id: null,
    str: 'Normal',
  },
  type: {
    directories: 0,
    files: 0,
    id: 'directory',
    str: '0 files',
  },
  virtual_name: 'Downloads test',
};

export const ShareRootRefreshing = {
  id: '2ZY3CFX22PQ75MLW2255ZJCTO52QEYGQBIJXJEI',
  incoming: false,
  last_refresh_time: 1605695850,
  path: '/home/share/100k items/',
  profiles: [
    {
      id: 0,
      str: 'Default',
    },
    {
      id: 687472893,
      str: 'Demo',
    },
  ],
  size: 0,
  status: {
    id: 'refresh_running',
    refresh_task_id: 388986095,
    str: 'Refreshing',
  },
  type: {
    directories: 100000,
    files: 0,
    id: 'directory',
    str: '100.0k folders',
  },
  virtual_name: '100k items',
};

export const ShareRootListResponse = [
  ShareRootRefreshing,
  ShareRootNormal,
  {
    id: 'P4SRPB4I4WRCJPW26BGWTNHQIBFODWIYUECEJ3I',
    incoming: false,
    last_refresh_time: 1751996399,
    path: '/home/www/builds/develop/',
    profiles: [
      {
        id: 0,
        str: 'Default',
      },
    ],
    size: 3221954493,
    status: {
      id: 'normal',
      refresh_task_id: null,
      str: 'Normal',
    },
    type: {
      directories: 2,
      files: 37,
      id: 'directory',
      str: '2 folders, 37 files',
    },
    virtual_name: 'develop',
  },
  {
    id: 'MDYZEJNIIAAL7BVSHMAQDUAP25UF5ISOCM2YD3Y',
    incoming: false,
    last_refresh_time: 1751996450,
    path: '/home/share/Test content/',
    profiles: [
      {
        id: 0,
        str: 'Default',
      },
      {
        id: 687472893,
        str: 'Demo',
      },
    ],
    size: 3104,
    status: {
      id: 'normal',
      refresh_task_id: null,
      str: 'Normal',
    },
    type: {
      directories: 0,
      files: 1,
      id: 'directory',
      str: '1 file',
    },
    virtual_name: 'Demo content',
  },
  {
    id: 'KJ6ASBCN2S3EELUP77AKRYAOWHXHACVC3AKIS4I',
    incoming: false,
    last_refresh_time: 1751996452,
    path: '/home/share/Test videos/',
    profiles: [
      {
        id: 0,
        str: 'Default',
      },
      {
        id: 687472893,
        str: 'Demo',
      },
    ],
    size: 9903562,
    status: {
      id: 'normal',
      refresh_task_id: null,
      str: 'Normal',
    },
    type: {
      directories: 0,
      files: 2,
      id: 'directory',
      str: '2 files',
    },
    virtual_name: 'Demo videos',
  },
  {
    id: 'IVPC5337JG6GRML2X4POCH376373RYS4RUTTHZY',
    incoming: false,
    last_refresh_time: 1751996453,
    path: '/home/airdcpp/airdcpp-share/Share/Ubuntu 15.10 Server/',
    profiles: [
      {
        id: 0,
        str: 'Default',
      },
      {
        id: 687472893,
        str: 'Demo',
      },
    ],
    size: 662700509,
    status: {
      id: 'normal',
      refresh_task_id: null,
      str: 'Normal',
    },
    type: {
      directories: 0,
      files: 2,
      id: 'directory',
      str: '2 files',
    },
    virtual_name: 'Ubuntu 15.10 Server',
  },
  {
    id: 'AXNFKLNQFLD4ZBXRCWNARF7CCU2OWCRTZTKEC7Y',
    incoming: true,
    last_refresh_time: 1751996448,
    path: '/home/share/Test audio/',
    profiles: [
      {
        id: 0,
        str: 'Default',
      },
      {
        id: 687472893,
        str: 'Demo',
      },
    ],
    size: 8494831,
    status: {
      id: 'normal',
      refresh_task_id: null,
      str: 'Normal',
    },
    type: {
      directories: 0,
      files: 3,
      id: 'directory',
      str: '3 files',
    },
    virtual_name: 'Demo audio',
  },
  {
    id: 'J6FVZV6GVRRDMNZI45WXF66TV34CLFKXVGOAYTY',
    incoming: false,
    last_refresh_time: 1751996450,
    path: '/home/share/Test pictures/',
    profiles: [
      {
        id: 0,
        str: 'Default',
      },
      {
        id: 687472893,
        str: 'Demo',
      },
    ],
    size: 47026894,
    status: {
      id: 'normal',
      refresh_task_id: null,
      str: 'Normal',
    },
    type: {
      directories: 0,
      files: 21,
      id: 'directory',
      str: '21 files',
    },
    virtual_name: 'Demo pictures',
  },
];
