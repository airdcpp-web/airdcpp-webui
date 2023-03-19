import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

const Entry = ['dont_download_shared', 'dont_download_queued', 'download_dupe_min_size'];

const Skiplist = ['download_skiplist', 'download_skiplist_regex'];

const SkippingOptionsPage: React.FC<SettingSectionChildProps> = (props) => (
  <div>
    <RemoteSettingForm {...props} keys={Entry} />

    <RemoteSettingForm
      title={props.moduleT.translate('Skiplist')}
      {...props}
      keys={Skiplist}
    />
  </div>
);

export default SkippingOptionsPage;
