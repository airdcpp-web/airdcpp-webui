import * as React from 'react';
import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';

const Entry = [
  'share_hidden',
  'share_no_empty_dirs',
  'share_no_zero_byte',
  'share_follow_symlinks',
  'share_max_size',
];

const Skiplist = ['share_skiplist', 'share_skiplist_regex'];

const SharingOptionsPage: React.FC<SettingPageProps> = ({ moduleT }) => (
  <div>
    <RemoteSettingForm keys={Entry} />
    <RemoteSettingForm title={moduleT.translate('Skiplist')} keys={Skiplist} />
  </div>
);

export default SharingOptionsPage;
