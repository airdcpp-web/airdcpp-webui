import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from 'routes/Settings/types';

const Entry = ['dont_download_shared', 'dont_download_queued', 'download_dupe_min_size'];

const Skiplist = ['download_skiplist', 'download_skiplist_regex'];

const SkippingOptionsPage: React.FC<SettingPageProps> = ({ moduleT }) => (
  <div>
    <RemoteSettingForm keys={Entry} />
    <RemoteSettingForm title={moduleT.translate('Skiplist')} keys={Skiplist} />
  </div>
);

export default SkippingOptionsPage;
