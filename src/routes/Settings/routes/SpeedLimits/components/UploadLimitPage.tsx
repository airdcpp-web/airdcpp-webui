import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import AutoValuePanel from 'routes/Settings/routes/SpeedLimits/components/AutoValuePanel';
import { SettingPageProps } from 'routes/Settings/types';

const Auto = [
  'upload_auto_limits',
  'upload_slots',
  'upload_auto_grant_speed',
  'upload_max_granted',
];

const Manual = ['upload_minislot_size', 'upload_minislot_ext'];

const UploadLimitPage: React.FC<SettingPageProps> = ({ moduleT }) => {
  const { translate } = moduleT;
  return (
    <div>
      <AutoValuePanel keys={Auto} type="upload" />
      <RemoteSettingForm title={translate('Manually set')} keys={Manual} />
    </div>
  );
};

export default UploadLimitPage;
