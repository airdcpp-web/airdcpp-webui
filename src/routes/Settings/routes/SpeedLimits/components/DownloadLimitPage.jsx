import React from 'react';
import AutoValuePanel from './AutoValuePanel';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

const Auto = [
  'download_auto_limits',
  'download_slots',
  'download_max_start_speed',
];

const Manual = [
  'download_highest_prio_slots',
];

const DownloadLimitPage = props => (
  <div>
    <AutoValuePanel
      { ...props }
      keys={ Auto }
      type="download"
    />

    <RemoteSettingForm
      { ...props }
      title="Manually set"
      keys={ Manual }
    />
  </div>
);

export default DownloadLimitPage;