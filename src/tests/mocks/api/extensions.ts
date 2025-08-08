export const ExtensionShareMonitoring = {
  author: 'maksis',
  description: 'Real time share monitoring',
  disabled: false,
  engines: ['node'],
  has_settings: false,
  homepage: '',
  id: 'airdcpp-share-monitor',
  logs: [
    {
      name: 'error.log',
      size: 1884,
      type: {
        content_type: '',
        id: 'file',
        str: 'log',
      },
    },
    {
      name: 'output.log',
      size: 28027,
      type: {
        content_type: '',
        id: 'file',
        str: 'log',
      },
    },
  ],
  managed: true,
  name: 'airdcpp-share-monitor',
  private: false,
  running: false,
  version: '1.2.0',
};

export const ExtensionsListResponse = [
  {
    author: 'pepsi',
    description:
      'BETA TESTING: Extension to add search terms that will be searched in intervals and downloaded when found.',
    disabled: false,
    engines: ['node'],
    has_settings: false,
    homepage: 'https://github.com/peps1/airdcpp-auto-downloader',
    id: 'airdcpp-auto-downloader',
    logs: [
      {
        name: 'error.log',
        size: 133,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
      {
        name: 'output.log',
        size: 9945,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
    ],
    managed: true,
    name: 'airdcpp-auto-downloader',
    private: false,
    running: false,
    version: '1.0.0-beta.13',
  },
  {
    author: 'maksis',
    description: 'Example Python 3.x extension for AirDC++',
    disabled: true,
    engines: ['python3'],
    has_settings: false,
    homepage: '',
    id: 'airdcpp-example-python-extension',
    logs: [
      {
        name: 'error.log',
        size: 0,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
      {
        name: 'output.log',
        size: 0,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
    ],
    managed: true,
    name: 'airdcpp-example-python-extension',
    private: true,
    running: false,
    version: '0.0.2',
  },
  {
    author: 'maksis',
    description: 'Sends email summaries with unread hub/private messages',
    disabled: false,
    engines: ['node'],
    has_settings: false,
    homepage: '',
    id: 'airdcpp-message-emailer',
    logs: [
      {
        name: 'error.log',
        size: 69,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
      {
        name: 'output.log',
        size: 5566,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
    ],
    managed: true,
    name: 'airdcpp-message-emailer',
    private: false,
    running: false,
    version: '1.0.5',
  },
  {
    author: 'maksis',
    description: 'Private test extension.',
    disabled: true,
    engines: ['node'],
    has_settings: false,
    homepage: '',
    id: 'airdcpp-private-test',
    logs: [
      {
        name: 'error.log',
        size: 69,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
      {
        name: 'output.log',
        size: 333,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
    ],
    managed: true,
    name: 'airdcpp-private-test',
    private: true,
    running: false,
    version: '0.0.1-beta2',
  },
  {
    author: 'maksis',
    description: 'Scan downloaded and shared release directories for missing/extra files',
    disabled: false,
    engines: ['node'],
    has_settings: false,
    homepage: '',
    id: 'airdcpp-release-validator',
    logs: [
      {
        name: 'error.log',
        size: 69,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
      {
        name: 'output.log',
        size: 7019,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
    ],
    managed: true,
    name: 'airdcpp-release-validator',
    private: false,
    running: false,
    version: '1.4.0',
  },
  {
    author: 'maksis',
    description:
      'Extension for adding configurable context menu items that will perform web searches for files/directories',
    disabled: false,
    engines: ['node'],
    has_settings: false,
    homepage: '',
    id: 'airdcpp-search-sites',
    logs: [
      {
        name: 'error.log',
        size: 69,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
      {
        name: 'output.log',
        size: 7525,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
    ],
    managed: true,
    name: 'airdcpp-search-sites',
    private: false,
    running: false,
    version: '1.2.0',
  },
  ExtensionShareMonitoring,
  {
    author: 'pepsi',
    description:
      'Extension to run commands from chat to output information or trigger actions. See /help for a full list',
    disabled: false,
    engines: ['node'],
    has_settings: false,
    homepage: 'https://github.com/peps1/airdcpp-user-commands',
    id: 'airdcpp-user-commands',
    logs: [
      {
        name: 'error.log',
        size: 69,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
      {
        name: 'output.log',
        size: 3666,
        type: {
          content_type: '',
          id: 'file',
          str: 'log',
        },
      },
    ],
    managed: true,
    name: 'airdcpp-user-commands',
    private: false,
    running: false,
    version: '2.2.2',
  },
];
