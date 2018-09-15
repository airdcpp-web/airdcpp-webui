import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import AutoValuePanel from 'routes/Settings/routes/SpeedLimits/components/AutoValuePanel';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

const Auto = [
  'upload_auto_limits',
  'upload_slots',
  'upload_auto_grant_speed',
  'upload_max_granted',
];

const Manual = [
  'upload_minislot_size',
  'upload_minislot_ext',
];

const UploadLimitPage: React.SFC<SettingSectionChildProps> = props => (
  <div>
    <AutoValuePanel
      { ...props }
      keys={ Auto }
      type="upload"
    />

    <RemoteSettingForm
      { ...props }
      title="Manually set"
      keys={ Manual }
    />
  </div>
);

export default UploadLimitPage;