import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

const Entry = [
  'share_hidden',
  'share_no_empty_dirs',
  'share_no_zero_byte',
  'share_follow_symlinks',
  'share_max_size',
];

const Skiplist = [
  'share_skiplist',
  'share_skiplist_regex',
];

const SharingOptionsPage = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
    />
    <RemoteSettingForm
      title="Skiplist"
      { ...props }
      keys={ Skiplist }
    />
  </div>
);

export default SharingOptionsPage;