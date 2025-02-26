import * as React from 'react';
import AutoValuePanel from '@/routes/Settings/routes/SpeedLimits/components/AutoValuePanel';

import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';

const Auto = ['download_auto_limits', 'download_slots', 'download_max_start_speed'];

const Manual = ['download_highest_prio_slots'];

const DownloadLimitPage: React.FC<SettingPageProps> = ({ moduleT }) => {
  const { translate } = moduleT;
  return (
    <div>
      <AutoValuePanel keys={Auto} type="download" />

      <RemoteSettingForm title={translate('Manually set')} keys={Manual} />
    </div>
  );
};

export default DownloadLimitPage;
