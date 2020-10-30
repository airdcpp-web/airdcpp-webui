import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

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

const SharingOptionsPage: React.FC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
    />
    <RemoteSettingForm
      title={ props.moduleT.translate('Skiplist') }
      { ...props }
      keys={ Skiplist }
    />
  </div>
);

export default SharingOptionsPage;