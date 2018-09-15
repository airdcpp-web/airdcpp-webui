import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

const Entry = [
  'segmented_downloads',
  'min_segment_size',
  'allow_slow_overlap',
  'finished_remove_exit',
  'use_partial_sharing',
];

const DownloadOptionsPage: React.SFC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
    />
  </div>
);

export default DownloadOptionsPage;