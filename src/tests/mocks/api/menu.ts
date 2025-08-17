export const RemoteMenu1ItemNormal = {
  form_definitions: null,
  hook_id: 'airdcpp-test',
  icon: {
    semantic: 'bell',
  },
  id: 'test_item_id',
  title: 'Test hook 1',
  urls: [],
};

export const RemoteMenu1ItemForm = {
  form_definitions: [
    {
      default_value: false,
      key: 'boolean',
      title: 'Yes/no',
      type: 'boolean',
    },
    {
      default_value: '',
      key: 'string',
      title: 'Text to show',
      type: 'string',
    },
    {
      default_value: '',
      key: 'hub_url',
      optional: true,
      title: 'Hub URL',
      type: 'hub_url',
    },
    {
      default_value: '',
      key: 'email',
      optional: true,
      title: 'Email',
      type: 'email',
    },
    {
      default_value: null,
      key: 'hinted_user',
      optional: true,
      title: 'Hinted User',
      type: 'hinted_user',
    },
    {
      default_value: '',
      key: 'password',
      optional: true,
      title: 'Password',
      type: 'password',
    },
    {
      default_value: '',
      key: 'file_path',
      optional: true,
      title: 'File path',
      type: 'file_path',
    },
    {
      default_value: '',
      key: 'directory_path',
      optional: true,
      title: 'Directory path',
      type: 'directory_path',
    },
    {
      default_value: '',
      key: 'existing_file_path',
      optional: true,
      title: 'Existing file path',
      type: 'existing_file_path',
    },
    {
      default_value: '',
      key: 'text',
      optional: true,
      title: 'Text',
      type: 'text',
    },
    {
      default_value: [],
      definitions: [
        {
          default_value: 1,
          key: 'number',
          min: 0,
          title: 'Number',
          type: 'number',
        },
        {
          default_value: '',
          key: 'url',
          optional: true,
          title: 'URL',
          type: 'url',
        },
      ],
      item_type: 'struct',
      key: 'list',
      optional: true,
      title: 'List',
      type: 'list',
    },
  ],
  hook_id: 'airdcpp-test',
  icon: {
    semantic: 'blue bell',
  },
  id: 'test_form',
  title: 'Test form',
  urls: [],
};

export const RemoteMenu1ItemWithChildren = {
  children: [
    {
      children: [
        {
          children: null,
          form_definitions: null,
          hook_id: 'airdcpp-test',
          icon: {
            semantic: 'red child',
          },
          id: 'deeply_nested_level3',
          title: 'Deeply nested 3',
          urls: [],
        },
      ],
      form_definitions: null,
      hook_id: 'airdcpp-test',
      icon: {
        semantic: 'yellow child',
      },
      id: 'deeply_nested_level2',
      title: 'Deeply nested 2',
      urls: [],
    },
  ],
  form_definitions: null,
  hook_id: 'airdcpp-test',
  icon: {
    semantic: 'green child',
  },
  id: 'deeply_nested_level1',
  title: 'Deeply nested 1',
  urls: [],
};

export const RemoteMenuGrouped1 = {
  icon: {},
  id: 'airdcpp-test',
  items: [
    RemoteMenu1ItemNormal,
    RemoteMenu1ItemForm,
    RemoteMenu1ItemWithChildren,
    {
      form_definitions: null,
      hook_id: 'airdcpp-test',
      icon: {
        semantic: 'red bell',
      },
      id: 'list_subscribers',
      title: 'List subscribers',
      urls: [],
    },
  ],
  title: 'Testing extension',
};

export const RemoteMenu2Item = {
  form_definitions: null,
  hook_id: 'airdcpp-release-validator',
  icon: {
    semantic: 'yellow broom',
  },
  id: 'scan_missing_extra',
  title: 'Scan for missing/extra files',
  urls: [],
};

export const RemoteMenuGrouped2 = {
  icon: {},
  id: 'airdcpp-release-validator',
  items: [RemoteMenu2Item],
  title: 'Release validator',
};

// export const GroupedRemoteMenuListResponse = [RemoteMenuGrouped1, RemoteMenuGrouped2];
